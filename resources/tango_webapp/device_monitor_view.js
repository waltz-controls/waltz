/** @module DeviceMonitorView */
(function () {
    /**
     * @type {webix.protoUI}
     */
    var device_monitor_header = webix.protoUI({
        _last_state: "UNKNOWN",
        name: "device_monitor_header",
        setValues: function (values, force) {
            webix.html.removeCss(this.getNode(), this._last_state, true);
            webix.html.addCss(this.getNode(), this._last_state = values.value, true);
            webix.ui.template.prototype.setValues.call(this, values, force);
        }
    }, webix.ui.template);

    /**
     * @type {webix.protoUI}
     */
    var device_monitor = webix.protoUI({
            _monitoredAttributes: {},//this is shared object across all components. In this case it is safe, as keys are unique ids
            loadAttributes: function () {
                var top = this.getTopParentView();
                var $$scalar = top.$$('scalar');
                var $$tabview = top.$$('attributes-tabview');
                var attrTabId;
                this._device.attributesInfo().then(function (attrsInfo) {
                    attrsInfo.forEach(function (attrInfo) {
                        switch (attrInfo.data_format) {
                            case "SCALAR":
                                //skip State&Status as they handled differently
                                if (attrInfo.name === 'State' || attrInfo.name === 'Status') return;
                                $$scalar.add({
                                    id: attrInfo.name,
                                    label: attrInfo.label,
                                    value: "N/A",
                                    quality: "N/A",
                                    unit: attrInfo.unit,
                                    description: attrInfo.description
                                });
                                //TODO save attr list item id for future updates
                                break;
                            case "SPECTRUM":
                                attrTabId = $$tabview.addView({
                                    header: attrInfo.label,
                                    body: TangoWebapp.ui.newSpectrumView({
                                        name: attrInfo.label,
                                        value: []
                                    })
                                });
                                this._monitoredAttributes[attrTabId] = attrInfo.name;
                                break;
                            case "IMAGE":
                                attrTabId = $$tabview.addView({
                                    header: attrInfo.label,
                                    body: TangoWebapp.ui.newImageView({
                                        name: attrInfo.label,
                                        value: []
                                    })
                                });
                                this._monitoredAttributes[attrTabId] = attrInfo.name;
                                break;
                        }
                    }.bind(this));
                }.bind(top)).then($$scalar.refresh);
            },
            update: function (what) {
                var $$state = this.$$('state');
                var $$status = this.$$('status');
                return function (attr) {
                    //update state and status
                    if (attr.name === 'State' && !$$state.$destructed)
                        $$state.setValues(attr, true);
                    else if (attr.name === 'Status' && !$$status.$destructed)
                        $$status.setValue(attr.value);
                    else
                        what(attr);
                }
            },
            run: function () {
                var attrs = ['State', 'Status'];
                var tabId = this.$$('attributes-tabview').getValue();
                if (tabId === 'scalar') {
                    var pull = this.$$('scalar').data.pull;
                    for (var id in  pull) {
                        if (!pull.hasOwnProperty(id)) continue;
                        attrs.push(id);
                    }

                    var $$scalar = this.$$('scalar');

                    this._device.readAttributes(attrs).then(function (resp) {
                        resp.forEach(this.update(function (attr) {
                            if (!$$scalar.$destructed)
                                $$scalar.updateItem(attr.name, attr);
                        }));
                    }.bind(this));
                } else {
                    var attr = this._monitoredAttributes[tabId];//TODO get selected tabId
                    attrs.push(attr);
                    this._device.readAttributes(attrs).then(function (resp) {
                        resp.forEach(this.update(function (attr) {
                            if (!this.$$(tabId).$destructed)
                                this.$$(tabId).update(attr.value);
                        }.bind(this)));
                    }.bind(this));
                }
            },
            _ui: function (device) {
                var top = this;
                return {
                    rows: [
                        {
                            cols: [
                                {
                                    id: "state",
                                    view: "device_monitor_header",
                                    template: "[#devname#] -- #value#",
                                    type: "header",
                                    data: {
                                        devname: device.name,
                                        value: "UNKNOWN"
                                    }
                                },
                                {
                                    width: 15
                                },
                                {
                                    view: "form",
                                    id: "frmUpdateRate",
                                    width: 320,
                                    elements: [{
                                        cols: [
                                            {
                                                view: "text",
                                                label: "Update rate (ms):",
                                                labelWidth: 120,
                                                value: top._delay,
                                                name: "updateRate",
                                                validate: webix.rules.isNumber
                                            },
                                            {
                                                view: "button",
                                                type: "iconButton",
                                                icon: "check",
                                                width: 36,
                                                click: function () {
                                                    var form = this.getFormView();
                                                    if (form.validate()) {
                                                        top.changeDelay(form.getValues().updateRate);
                                                    }
                                                }
                                            },
                                            {
                                                view: "button",
                                                type: "iconButton",
                                                icon: "cogs",
                                                width: 36,
                                                click: function (id, ev) {
                                                    var top = this.getTopParentView();
                                                    var device = top._device;

                                                    TangoWebapp.helpers.openDeviceTab(device, 'device_attr_config');
                                                }
                                            }
                                        ]
                                    }
                                    ]
                                },
                                {
                                    width: 10
                                }
                            ]
                        },
                        {
                            view: "fieldset",
                            label: "Status:",
                            body: {
                                view: "textarea",
                                id: "status",
                                minHeight: 50,
                                value: "Device is in UNKNOWN state"
                            }
                        },
                        {view: "resizer"},
                        {
                            view: "tabview",
                            gravity: 4,
                            animate: false,
                            id: "attributes-tabview",
                            cells: [
                                {
                                    header: "Scalar",
                                    select: "row", multiselect: true,
                                    body: {
                                        view: "datatable",
                                        id: "scalar",
                                        scheme: {
                                            $update: function (item) {
                                                if (item.quality === 'ATTR_ALARM' || item.quality === 'ATTR_INVALID') item.$css = {"background-color": "lightcoral"};
                                                else if (item.quality === 'ATTR_WARNING') item.$css = {"background-color": "orange"};
                                                else delete item.$css;
                                            }
                                        },
                                        columns: [
                                            {
                                                id: "label",
                                                header: "Name",
                                                width: TangoWebapp.consts.NAME_COLUMN_WIDTH,
                                                sort: "string"
                                            },
                                            {id: "value", header: "Value", width: 100},
                                            {id: "quality", header: "Quality", width: 100, sort: "string"},
                                            {id: "unit", header: "Unit", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                            {id: "description", header: "Description", fillspace: true}
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                };
            },
            name: "device_monitor",
            $init: function (config) {
                webix.extend(config, this._ui(config.device));

                this.$ready.push(this.loadAttributes);

                this.$ready.push(this.start);
            }
        }, webix.IdSpace, webix.EventSystem,
        TangoWebapp.mixin.DeviceSetter, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.Runnable,
        webix.ui.layout);

    TangoWebapp.ui.newDeviceMonitorView = function (config) {
        return {
            view: "device_monitor",
            id: config.id,
            device: config.device
        }
    };
})();

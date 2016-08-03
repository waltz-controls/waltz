webix.protoUI({
        _monitoredAttributes: {},//this is shared object across all components. In this case it is safe, as keys are unique ids
        updateState: function () {
            var $$state = this.$$('state');
            var $$status = this.$$('status');
            this._device.state().then(function (state) {
                //may happen on destructed view
                if(!$$state.destructed) {
                    $$state.setValues(state, true);
                }
                $$status.setValue(state.status);
            });
        },
        loadAttributes: function () {
            var top = this.getTopParentView();
            var $$scalar = top.$$('scalar');
            var $$tabview = top.$$('attributes-tabview');
            var attrTabId;
            this._device.attributesInfo().then(function (attrsInfo) {
                attrsInfo.forEach(function (attrInfo) {
                    switch (attrInfo.data_format) {
                        case "SCALAR":
                            $$scalar.add(attrInfo);
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
        run: function () {
            this.updateState();
            var attr;
            var tabId = this.$$('attributes-tabview').getValue();
            if (tabId === 'scalar') {
                TangoWebapp.helpers.iterate(this.$$('scalar'), function (id, attr) {
                    this._device.readAttribute(attr.name).then(function (resp) {
                        this.$$('scalar').updateItem(id, resp);
                        if (resp.quality !== 'VALID') this.$$('scalar').select(id, true);
                    }.bind(this));
                }.bind(this));
            } else {
                attr = this._monitoredAttributes[tabId];
                this._device.readAttribute(attr).then(function (resp) {
                    $$(tabId).update(resp.value);
                }.bind(this));
            }
        },
        _getUI: function (device) {
            var top = this;
            return {
                rows: [
                    {
                        cols: [
                            {
                                id: "state",
                                view: "template",
                                template: "[#name#] -- #state#",
                                type: "header",
                                data: {
                                    name: device.name,
                                    state: "UNKNOWN"
                                }
                            },
                            {
                                width: 15
                            },
                            {
                                view: "form",
                                id: "frmUpdateRate",
                                width: 250,
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
                                    columns: [
                                        {id: "label", header: "Name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                        {id: "value", header: "Value", width: 100},
                                        {id: "quality", header: "Quality", width: 100, sort: "string"},
                                        {id: "unit", header: "Unit", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                        {id: "settings", header: "", fillspace: true}
                                    ]
                                }
                            }
                        ]
                    }
                ]
            };
        },
        name: "ATKPanel",
        $init: function (config) {
            webix.extend(config, this._getUI(config.device));

            this.$ready.push(this.loadAttributes);

            this.$ready.push(this.start);
        }
    }, webix.IdSpace, webix.EventSystem,
    TangoWebapp.mixin.DeviceSetter, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.Runnable,
    webix.ui.layout);

TangoWebapp.ui.newAtkPanel = function (config) {
    return {
        view: "ATKPanel",
        id: config.id,
        device: config.device
    }
};


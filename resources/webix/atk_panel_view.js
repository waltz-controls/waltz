webix.protoUI({
    _updateRate: 1000,
    _monitoredScalarAttributes: {},
    _intervalId: 0,
    setUpdateRate: function (updateRate) {
        this._updateRate = updateRate;

        if (this._intervalId != 0) {
            clearInterval(this._intervalId);
            this._intervalId = setInterval(this.updateValues.bind(this), updateRate);
        }
    },
    updateState: function () {
        var $$state = this.$$('state');
        var $$status = this.$$('status');
        this._device.state().then(function (state) {
            $$state.setValues({
                state: state.state
            }, true);
            $$status.setValue(state.status);
        });
    },
    updateAttributes: function () {
        var top = this.getTopParentView();
        var $$scalar = top.$$('scalar');
        var $$tabview = top.$$('attributes-tabview');
        var attrTab;
        this._device.attributesInfo().then(function (attrsInfo) {
            attrsInfo.forEach(function (attrInfo) {
                switch (attrInfo.data_format) {
                    case "SCALAR":
                        var attrId = $$scalar.add(attrInfo);

                        top._monitoredScalarAttributes[attrInfo.name] = attrId;
                        //TODO save attr list item id for future updates
                        break;
                    case "SPECTRUM":
                        attrTab = $$tabview.addView({
                            header: attrInfo.label,
                            body: TangoWebapp.ui.newSpectrumView({
                                id: attrInfo.name,
                                name: attrInfo.label,
                                value: []
                            })
                        });
                        break;
                    case "IMAGE":
                        attrTab = $$tabview.addView({
                            header: attrInfo.label,
                            body: TangoWebapp.ui.newImageView({
                                id: attrInfo.name,
                                name: attrInfo.label,
                                value: []
                            })
                        });
                        break;
                }
            });
        }.bind(this)).then($$scalar.refresh);
    },
    updateValues: function () {
        this.updateState();
        var tabId = this.$$('attributes-tabview').getValue();
        if (tabId === 'scalar') {
            var attrs = this._monitoredScalarAttributes;
            for (var attr in attrs) {
                if (!attrs.hasOwnProperty(attr)) continue;
                this._device.readAttribute(attr).then(function (attr, resp) {
                    this.$$('scalar').updateItem(attrs[attr], resp);
                }.bind(this, attr));
            }
        } else {
            this._device.readAttribute(tabId).then(function (resp) {
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
                            id: "btnSettings",
                            view: "button",
                            type: "iconButton",
                            width: 36,
                            icon: "cog",
                            popup: "updateRatePopup"
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
                            body: {
                                view: "datatable",
                                id: "scalar",
                                columns: [
                                    {id: "name", header: "Name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: "value", header: "Value", width: 100},
                                    {id: "quality", header: "Quality", width: 100},
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

        this.$ready.push(this.updateState);
        this.$ready.push(this.updateAttributes);

        this.$ready.push(function(){
            this._intervalId = setInterval(this.updateValues.bind(this), this._updateRate);
        });

        this.$ready.push(function () {
            var top = this;
            webix.ui({
                view: "popup",
                id: "updateRatePopup",
                body: {
                    view: "form",
                    id: "frmUpdateRate",
                    elements: [
                        {
                            view: "text",
                            label: "Update rate:",
                            labelWidth: 100,
                            value: top._updateRate,
                            name: "updateRate",
                            validate: webix.rules.isNumber
                        },
                        {
                            view: "button",
                            type: "form",
                            value: "Set update rate",
                            click: function () {
                                var form = this.getFormView();
                                if (form.validate()) {
                                    top.setUpdateRate(form.getValues().updateRate);
                                    this.getTopParentView().hide();
                                }
                            }
                        }
                    ]
                }
            }).hide();
        });
    },
    defaults: {
        on: {
            onHide: function(){
                clearInterval(this._intervalId);
            }
        }
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.mixin.DeviceSetter, TangoWebapp.mixin.TabActivator, webix.ui.layout);

TangoWebapp.ui.newAtkPanel = function (device) {
    return {
        view: "ATKPanel",
        id: "atk" + device.id,
        device: device
    }
};


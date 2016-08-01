webix.protoUI({
    _monitoredAttributes:{},//this is shared object across all components. In this case it is safe, as keys are unique ids
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
            TangoWebapp.helpers.iterate(this.$$('scalar'), function(id, attr){
                this._device.readAttribute(attr.name).then(function (resp) {
                    this.$$('scalar').updateItem(id, resp);
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
    _updateRatePopup: webix.ui({
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
                    value: top._delay,
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
                            top.changeDelay(form.getValues().updateRate);
                            this.getTopParentView().hide();
                        }
                    }
                }
            ]
        }
    }),
    name: "ATKPanel",
    $init: function (config) {
        this._updateRatePopup.hide();

        webix.extend(config, this._getUI(config.device));

        this.$ready.push(this.updateState);
        this.$ready.push(this.updateAttributes);

        this.$ready.push(this.start);
    },
    defaults: {
        on: {
            onHide: function(){
                clearInterval(this._intervalId);
            }
        }
    }
}, webix.IdSpace, webix.EventSystem,
    TangoWebapp.mixin.DeviceSetter, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.Runnable,
    webix.ui.layout);

TangoWebapp.ui.newAtkPanel = function (device) {
    return {
        view: "ATKPanel",
        id: "atk" + device.id,
        device: device
    }
};


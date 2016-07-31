webix.protoUI({
    _updateRate: 1000,
    setUpdateRate:function(){
        var top = this.getTopParentView();



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
        var $$scalar = this.$$('scalar');
        var $$tabs = this.$$('attributes-tabbar');
        var $$cells = this.$$('attributes-cells');
        this._device.attributesInfo().then(function (attrsInfo) {
            attrsInfo.forEach(function (attrInfo) {
                switch (attrInfo.data_format) {
                    case "SCALAR":
                        $$scalar.add(attrInfo);

                        //TODO save attr list item id for future updates
                        break;
                    case "SPECTRUM":
                        //TODO add dedicated tab with plot
                        $$tabs.addOption(attrInfo.name, attrInfo.name);
                        $$cells.addView(TangoWebapp.ui.newSpectrumView({
                            name: attrInfo.name,
                            value: []
                        }));
                        break;
                    case "IMAGE":
                        //TODO add image tab
                        $$tabs.addOption(attrInfo.name, attrInfo.name);
                        $$cells.addView(TangoWebapp.ui.newImageView({
                            name: attrInfo.name,
                            value: []
                        }));
                        break;
                }
            });
        }.bind(this)).then(function () {
            $$scalar.refresh();
        });
    },
    updateAttributesValues: function () {
        //TODO
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
                    gravity: 4,
                    rows: [
                        {
                            id: "attributes-cells",
                            cells: [
                                {
                                    view: "datatable",
                                    id: "scalar",
                                    columns: [
                                        {id: "name", header: "Name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                        {id: "value", header: "Value", width: 100},
                                        {id: "unit", header: "Unit", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                        {id: "settings", header: "", fillspace: true}
                                    ]

                                }
                            ]
                        },
                        {
                            view: "tabbar", id: 'attributes-tabbar', value: 'listView', multiview: true, options: [
                            {value: 'Scalar', id: 'listView'}
                        ]
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
            var top = this;
            webix.ui({
                view:"popup",
                id:"updateRatePopup",
                body:{
                    view:"form",
                    id:"frmUpdateRate",
                    elements:[
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
                            click: function(){
                                var form = this.getFormView();
                                if(form.validate()){
                                    top._updateRate = form.getValues().updateRate;//TODO call event
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
        on: {}
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.mixin.DeviceSetter, TangoWebapp.mixin.TabActivator, webix.ui.layout);

TangoWebapp.ui.newAtkPanel = function (device) {
    return {
        view: "ATKPanel",
        id: "atk" + device.id,
        device: device
    }
};


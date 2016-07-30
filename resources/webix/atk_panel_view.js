webix.protoUI({
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
        this._device.attributesInfo().then(function(attrsInfo){
            attrsInfo.forEach(function(attrInfo){
                switch(attrInfo.data_format){
                    case "SCALAR":
                        $$scalar.add(attrInfo);
                        //TODO save attr list item id for future updates
                        break;
                    case "SPECTRUM":
                        //TODO add dedicated tab with plot
                        break;
                    case "IMAGE":
                        //TODO add image tab
                        break;
                }
            });
        }.bind(this)).then(function(){
            $$scalar.refresh();
        });
    },
    _getUI: function (device) {
        var top = this;
        return {
            rows: [
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
                    rows: [
                        {cells: [
                            {
                                view: "list",
                                template: "#name# = #value#  #unit#",
                                id: "scalar"
                            }
                        ]},
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


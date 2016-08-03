webix.protoUI({
    refresh:function(){
        var top = this.getTopParentView();

        var device = top._device;

        device.attributesInfo();
    },
    apply: function(){
        var top = this.getTopParentView();

        TangoWebapp.helpers.iterate(top._device.attributeInfoDataCollection, function(id, info){
            this.updateAttributeInfo(info.name);
        }.bind(top._device));
    },
    _getUI:function(){
        var top = this;
        return {
            rows: [
                {
                    height: 5
                },
                {
                    view: "tabview",
                    cells: [
                        {
                            header: "Display",
                            body: {
                                id: "display",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'label', header: "Label", editor: "text", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'format', header: "Format", editor: "text", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Unit",
                            body: {
                                id: "unit",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'unit', header: "Unit", editor: "text"},
                                    {id:'display_unit', header: "Display unit", editor: "text"},
                                    {id:'standard_unit', header: "Standard unit", editor: "text", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Range",
                            body: {
                                id: "range",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'min_value', header: "Min value", editor: "text"},
                                    {id:'max_value', header: "Max value", editor: "text", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Alarms",
                            body: {
                                id: "alarms",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'alarms.min_alarm', header: "Min alarm", editor: "text", template:function(obj){return obj.alarms.min_alarm;}},
                                    {id:'alarms.max_alarm', header: "Max alarm", editor: "text", template:function(obj){return obj.alarms.max_alarm;}},
                                    {id:'alarms.min_warning',header: "Min warning", editor: "text", template:function(obj){return obj.alarms.min_warning;}},
                                    {id:'alarms.max_warning', header: "Max warning", editor: "text", template:function(obj){return obj.alarms.max_warning;}},
                                    {id:'alarms.delta_t', header: "Delta t", editor: "text", template:function(obj){return obj.alarms.delta_t;}},
                                    {id:'alarms.delta_val', header: "Delta val", editor: "text", template:function(obj){return obj.alarms.delta_val;}, fillspace: true}
                                ]
                            }
                        },
                        {
                            header: "Description",
                            body: {
                                id: "description",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'description', header: "Description", editor: "text", fillspace: true}
                                ]
                            }
                        } ,
                        {
                            header: "Alias",
                            body: {
                                id: "alias",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id:'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id:'alias', header: "Alias", editor: "text", fillspace: true}
                                ]
                            }
                        }
                    ]
                },
                {
                    view: "toolbar",
                    cols: [
                        {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left", click: top.refresh},
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left", click: top.apply}]
                }

            ]
        };
    },
    $init: function(config){
        webix.extend(config, this._getUI());


        this.$ready.push(function(){
            this.$$('display').sync(this._device.attributeInfoDataCollection);
            this.$$('unit').sync(this._device.attributeInfoDataCollection);
            this.$$('range').sync(this._device.attributeInfoDataCollection);
            this.$$('alarms').sync(this._device.attributeInfoDataCollection);
            this.$$('description').sync(this._device.attributeInfoDataCollection);
            this.$$('alias').sync(this._device.attributeInfoDataCollection);
        });

        this.$ready.push(this.refresh);
    },
    name: "DeviceAttrConfig"
}, webix.IdSpace, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.ui.newDeviceAttrConfig = function (device) {
    return {
        view: "DeviceAttrConfig",
        id  : "device_attr_config",
        device: device
    };
};
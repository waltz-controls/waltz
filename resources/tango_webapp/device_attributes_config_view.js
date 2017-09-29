(function () {
    webix.protoUI({
        refresh: function () {
            var top = this.getTopParentView();

            var device = top._device;

            top.$$alarms.clearAll();
            device.attributesInfo().then(function () {
                TangoWebapp.helpers.iterate(device.attributeInfoCollection, function (id, info) {
                    this.$$alarms.add({
                        masterId: id,
                        name: info.name,
                        min_alarm: info.alarms.min_alarm,
                        max_alarm: info.alarms.max_alarm,
                        min_warning: info.alarms.min_warning,
                        max_warning: info.alarms.max_warning,
                        delta_t: info.alarms.delta_t,
                        delta_val: info.alarms.delta_val
                    });
                }.bind(top));
            });
        },
        apply: function () {
            var top = this.getTopParentView();

            TangoWebapp.helpers.iterate(top._device.attributeInfoCollection, function (id, info) {
                this.updateAttributeInfo(info.name);
            }.bind(top._device));
        },
        _ui: function () {
            var top = this;
            return {
                rows: [
                    {
                        height: TangoWebapp.consts.TABS_DELIMITER_HEIGHT
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
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {
                                            id: 'label',
                                            header: "Label",
                                            editor: "text",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'format', header: "Format", editor: "text", fillspace: true}
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
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'unit', header: "Unit", editor: "text"},
                                        {id: 'display_unit', header: "Display unit", editor: "text"},
                                        {id: 'standard_unit', header: "Standard unit", editor: "text", fillspace: true}
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
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'min_value', header: "Min value", editor: "text"},
                                        {id: 'max_value', header: "Max value", editor: "text", fillspace: true}
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
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'min_alarm', header: "Min alarm", editor: "text"},
                                        {id: 'max_alarm', header: "Max alarm", editor: "text"},
                                        {id: 'min_warning', header: "Min warning", editor: "text"},
                                        {id: 'max_warning', header: "Max warning", editor: "text"},
                                        {id: 'delta_t', header: "Delta t", editor: "text"},
                                        {id: 'delta_val', header: "Delta val", editor: "text", fillspace: true}
                                    ],
                                    scheme: {
                                        $update: function (obj) {
                                            var info = top._device.attributeInfoCollection.getItem(obj.masterId);

                                            info.alarms.min_alarm = obj.min_alarm;
                                            info.alarms.max_alarm = obj.max_alarm;
                                            info.alarms.min_warning = obj.min_warning;
                                            info.alarms.max_warning = obj.max_warning;
                                            info.alarms.delta_t = obj.delta_t;
                                            info.alarms.delta_val = obj.delta_val;

                                            top._device.attributeInfoCollection.updateItem(obj.masterId, info);
                                        }
                                    }
                                }
                            },
                            {
                                header: "Description",
                                body: {
                                    id: "description",
                                    view: "datatable",
                                    editable: true,
                                    columns: [
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'description', header: "Description", editor: "text", fillspace: true}
                                    ]
                                }
                            },
                            {
                                header: "Alias",
                                body: {
                                    id: "alias",
                                    view: "datatable",
                                    editable: true,
                                    columns: [
                                        {
                                            id: 'name',
                                            header: "Attribute name",
                                            width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                        },
                                        {id: 'alias', header: "Alias", editor: "text", fillspace: true}
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        view: "toolbar",
                        cols: [
                            {
                                view: "button",
                                id: "btnRefresh",
                                value: "Refresh",
                                width: 100,
                                align: "left",
                                click: top.refresh
                            },
                            {
                                view: "button",
                                id: "btnApply",
                                value: "Apply",
                                width: 100,
                                align: "left",
                                click: top.apply
                            }]
                    }

                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());


            this.$ready.push(function () {
                //TODO
                // this.$$('display').sync(this._device.attributeInfoCollection);
                // this.$$('unit').sync(this._device.attributeInfoCollection);
                // this.$$('range').sync(this._device.attributeInfoCollection);
                // this.$$('description').sync(this._device.attributeInfoCollection);
                // this.$$('alias').sync(this._device.attributeInfoCollection);

                this.$$alarms = this.$$('alarms');

                // this.refresh();
            });
        },
        name: "device_attr_config"
    }, webix.IdSpace, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

    TangoWebapp.ui.newDeviceAttrConfigView = function (device) {
        return {
            view: "device_attr_config",
            id: "device-attr-config",
            device: device
        };
    };
})();
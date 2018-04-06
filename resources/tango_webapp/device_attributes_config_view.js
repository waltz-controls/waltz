(function () {
    var update_attr_info = function (info) {
        var attr = TangoAttribute.find_one(info.masterId);
        attr.set_attributes({info: info});
        var device = PlatformContext.devices.getItem(attr.device_id);
        device.attrs.updateItem(attr.id, attr);
    };

    var display_tab_body = {
        id: "display",
        view: "datatable",
        editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {
                id: 'label',
                header: "Label",
                editor: "text",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {
                id: 'format',
                header: "Format",
                editor: "text",
                fillspace: true
            }
        ],
        scheme: {
            $update: update_attr_info
        }

    };

    var unit_tab_body = {
        id: "unit",
        view: "datatable",
        editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {id: 'unit', header: "Unit", editor: "text"},
            {id: 'display_unit', header: "Display unit", editor: "text"},
            {id: 'standard_unit', header: "Standard unit", editor: "text", fillspace: true}
        ],
        scheme: {
            $update: update_attr_info
        }

    };

    var range_tab_body = {
        id: "range",
        view: "datatable",
        editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {id: 'min_value', header: "Min value", editor: "text"},
            {id: 'max_value', header: "Max value", editor: "text", fillspace: true}
        ],
        scheme: {
            $update: update_attr_info
        }
    };

    var alarms_tab_body = {
        id: "alarms",
        view: "datatable",
        editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
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
                var attr = TangoAttribute.find_one(obj.masterId);
                //TODO extract TangoAttributeInfo
                var info = attr.info;

                info.alarms.min_alarm = obj.min_alarm;
                info.alarms.max_alarm = obj.max_alarm;
                info.alarms.min_warning = obj.min_warning;
                info.alarms.max_warning = obj.max_warning;
                info.alarms.delta_t = obj.delta_t;
                info.alarms.delta_val = obj.delta_val;

                attr.set_attributes({info: info});
                var device = PlatformContext.devices.getItem(attr.device_id);
                device.attrs.updateItem(attr.id, attr);
            }
        }
    };

    var description_tab_body = {
        id: "description",
        view: "datatable",
        editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {id: 'description', header: "Description", editor: "text", fillspace: true}
        ],
        scheme: {
            $update: update_attr_info
        }
    };

    var alias_tab_body = {
        id: "alias",
        view: "datatable",
        // editable: true,
        columns: [
            {
                id: 'name',
                header: "Attribute name",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
            },
            {id: 'alias', header: "Alias", editor: "text", fillspace: true}
        ]
    };

    /**
     * @type {webix.protoUI}
     */
    var attr_config_view = webix.protoUI({
        _attr_infos: null,
        refresh: function () {
            var top = this.getTopParentView();

            var device = top._device;

            top.$$alarms.clearAll();
            device.fetchAttrs().then(function (attrs) {
                attrs.forEach(function (attr) {
                    var id = attr.id;
                    var info = attr.info;
                    this.$$alarms.add({
                        masterId: id,
                        name: info.name,
                        min_alarm: info.alarms.min_alarm,
                        max_alarm: info.alarms.max_alarm,
                        min_warning: info.alarms.min_warning,
                        max_warning: info.alarms.max_warning,
                        delta_t: info.alarms.delta_t,
                        delta_val: info.alarms.delta_val
                    })
                }.bind(top));
            }).then(TangoWebappHelpers.log.bind(null, "Attribute configuration has been refreshed"))
                .fail(TangoWebappHelpers.error);
        },
        apply: function () {
            var top = this.getTopParentView();

            TangoWebappHelpers.iterate(top._device.attrs, function (attr) {
                attr.putInfo()
                    .then(TangoWebappHelpers.log.bind(null, "Attribute[" + attr.name + "] configuration has been updated"))
                    .then(function () {
                        OpenAjax.hub.publish("tango_webapp.device_view.update_attr_config", {data: attr.info})
                    })
                    .fail(TangoWebappHelpers.error);
            });
        },
        _ui: function () {
            var top = this;
            return {
                rows: [
                    {
                        height: TangoWebappPlatform.consts.TABS_DELIMITER_HEIGHT
                    },
                    {
                        view: "tabview",
                        cells: [
                            {
                                header: "Display",
                                body: display_tab_body
                            },
                            {
                                header: "Unit",
                                body: unit_tab_body
                            },
                            {
                                header: "Range",
                                body: range_tab_body
                            },
                            {
                                header: "Alarms",
                                body: alarms_tab_body
                            },
                            {
                                header: "Description",
                                body: description_tab_body
                            },
                            {
                                header: "Alias",
                                body: alias_tab_body
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

            this._attr_infos = new webix.DataCollection();

            //TODO sync with device.attrs
            config.device.fetchAttrs().then(function (attrs) {
                var infos = attrs.map(function (it) {
                    return webix.extend(webix.copy(it.info), {masterId: it.id});
                });
                this._attr_infos.parse(infos);
            }.bind(this));

            this.$ready.push(function () {
                this.$$('display').sync(this._attr_infos);
                this.$$('unit').sync(this._attr_infos);
                this.$$('range').sync(this._attr_infos);
                this.$$('description').sync(this._attr_infos);
                this.$$('alias').sync(this._attr_infos);

                this.$$alarms = this.$$('alarms');

                this.refresh();
            }.bind(this));
        },
        name: "device_attr_config"
    }, webix.IdSpace, TangoWebappPlatform.mixin.TabActivator, TangoWebappPlatform.mixin.DeviceSetter, webix.ui.layout);

    TangoWebapp.ui.newDeviceAttrConfigView = function (device) {
        return {
            view: "device_attr_config",
            id: "device-attr-config",
            device: device
        };
    };
})();
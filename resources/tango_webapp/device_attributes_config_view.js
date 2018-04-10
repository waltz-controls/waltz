(function () {
    var attribute_name_column = function () {
        return {
            id: 'name',
            header: ["Attribute name", {content: "textFilter"}],
            width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
            template: function (obj) {
                return obj.attr.name;
            }
        };
    };

    var display_tab_body = {
        id: "display",
        view: "datatable",
        editable: true,
        columns: [
            attribute_name_column(),
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
        ]
    };

    var unit_tab_body = {
        id: "unit",
        view: "datatable",
        editable: true,
        columns: [
            attribute_name_column(),
            {id: 'unit', header: "Unit", editor: "text"},
            {id: 'display_unit', header: "Display unit", editor: "text"},
            {id: 'standard_unit', header: "Standard unit", editor: "text", fillspace: true}
        ]
    };

    var range_tab_body = {
        id: "range",
        view: "datatable",
        editable: true,
        columns: [
            attribute_name_column(),
            {id: 'min_value', header: "Min value", editor: "text"},
            {id: 'max_value', header: "Max value", editor: "text", fillspace: true}
        ]
    };

    var alarms_tab_body = {
        id: "alarms",
        view: "datatable",
        editable: true,
        columns: [
            attribute_name_column(),
            {
                id: 'min_alarm', header: "Min alarm", editor: "text", template: function (obj) {
                    return obj.alarms.min_alarm;
                }
            },
            {
                id: 'max_alarm', header: "Max alarm", editor: "text", template: function (obj) {
                    return obj.alarms.max_alarm;
                }
            },
            {
                id: 'min_warning', header: "Min warning", editor: "text", template: function (obj) {
                    return obj.alarms.min_warning;
                }
            },
            {
                id: 'max_warning', header: "Max warning", editor: "text", template: function (obj) {
                    return obj.alarms.max_warning;
                }
            },
            {
                id: 'delta_t', header: "Delta t", editor: "text", template: function (obj) {
                    return obj.alarms.delta_t;
                }
            },
            {
                id: 'delta_val', header: "Delta val", editor: "text", fillspace: true, template: function (obj) {
                    return obj.alarms.delta_val;
                }
            }
        ],
        scheme: {
            $update: function (obj) {
                //this method works around webix limitation on editing complex data in a datatable

                ['min_alarm', 'max_alarm', 'min_warning', 'max_warning', 'delta_t', 'delta_val']
                .filter(function (el) {
                    return obj[el];
                }).forEach(function (el) {
                    obj.alarms[el] = obj[el];
                    delete obj[el];
                });

                // obj.update_attributes({
                //     alarms: obj.alarms
                // });
            }
        }
    };

    var description_tab_body = {
        id: "description",
        view: "datatable",
        editable: true,
        columns: [
            attribute_name_column(),
            {id: 'description', header: "Description", editor: "text", fillspace: true}
        ]
    };

    var alias_tab_body = {
        id: "alias",
        view: "datatable",
        // editable: true,
        columns: [
            attribute_name_column(),
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

            device.fetchAttrs()
                .then(TangoWebappHelpers.log.bind(null, "Attribute configuration has been refreshed"))
                .fail(TangoWebappHelpers.error);
        },
        apply: function () {
            var top = this.getTopParentView();

            TangoWebappHelpers.iterate(top._device.attr_infos, function (info) {
                info.put()
                    .then(TangoWebappHelpers.log.bind(null, "Attribute[" + info.attr.name + "] configuration has been updated"))
                    .then(function () {
                        OpenAjax.hub.publish("tango_webapp.device_view.update_attr_config", {data: info})
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
        _device: null,
        $init: function (config) {
            webix.extend(config, this._ui());

            //TODO sync with device.attrs
            this._device = config.device;
            this._device.fetchAttrs();

            this.$ready.push(function () {
                this.$$('display').sync(this._device.attr_infos);
                this.$$('unit').sync(this._device.attr_infos);
                this.$$('range').sync(this._device.attr_infos);
                this.$$('description').sync(this._device.attr_infos);
                this.$$('alias').sync(this._device.attr_infos);
                this.$$('alarms').sync(this._device.attr_infos);
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
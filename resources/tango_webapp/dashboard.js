//isolate this component
(function () {
    var getting_started = {
        minWidth: 240,
        minHeight: 240,
        rows: [
            {
                type: 'header',
                height: 30,
                template: "<span class='webix_strong'>Getting started</span>"
            },
            {
                template: new View({url: 'views/getting_started.ejs'}).render()
            }
        ]
    };

    var server_wizard = webix.protoUI({
        name: 'server_wizard',
        /**
         *
         * @param {Object} data
         *
         * @private
         */
        _create_devices: function (data) {
            webix.promise.all(
                data.values.devices.map(function (it) {
                    return data.host.fetchDatabase()
                        .then(function (db) {
                            return db.addDevice([data.values.server, it, data.values.className])
                        })
                        .then(TangoWebappHelpers.log.bind(null, "Device " + it + " has been added"))
                        .fail(TangoWebappHelpers.error.bind(null, "Failed to add device " + it));
                })
            ).then($$('devices-tree').updateRoot.bind($$('devices-tree'), PlatformContext));
        },
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 30,
                        template: "<span class='webix_icon fa-magic'></span><span class='webix_strong'> Tango Server Wizard</span>"
                    },
                    {
                        view: 'form',
                        id: 'form',
                        elements: [
                            {
                                view: 'text',
                                readonly: true,
                                disabled: true,
                                name: 'tango_host',
                                label: "Tango host:",
                                labelWidth: 150,
                                labelPosition: "top",
                                placeholder: 'select in Tango hosts',
                                validate: webix.rules.isNotEmpty,
                                invalidMessage: "Tango host must be set"
                            },
                            {
                                view: "text",
                                name: "server",
                                label: "ServerName/Instance:",
                                labelWidth: 150,
                                labelPosition: "top",
                                placeholder: "server/instance, i.e. TangoTest/test",
                                validate: function (value) {
                                    return /^[\w]*\/[\w]*$/.test(value);
                                }, invalidMessage: "Incorrect server/instance"
                            },
                            {
                                view: "text",
                                name: "className",
                                label: "Class name:",
                                labelWidth: 150,
                                labelPosition: "top",
                                placeholder: "device class, i.e. MyClass",
                                validate: webix.rules.isNotEmpty,
                                invalidMessage: "Can not be empty"
                            },
                            {
                                view: "textarea0",
                                name: "devices",
                                label: "Devices:",
                                height: 120,
                                labelWidth: 150,
                                labelPosition: "top",
                                placeholder: "instance/family/member, i.e. sys/tg_test/1",
                                validate: function (value) {
                                    var rv = false;
                                    do {
                                        rv = /[\w]*\/[\w]*\/[\w]*/.test(value.shift());
                                    } while (rv && value.length != 0);
                                    return rv;
                                }, invalidMessage: "Incorrect devices"
                            },
                            {
                                view: 'button',
                                type: 'form',
                                value: 'Create new Tango devices...',
                                click: function () {
                                    var form = this.getFormView();
                                    var isValid = form.validate();
                                    if (!isValid) return;


                                    this.getTopParentView()._create_devices({
                                        host: form.elements.tango_host.data.value,
                                        values: form.getValues()
                                    });
                                }
                            }
                        ]
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('form').elements.tango_host.bind(PlatformContext.tango_hosts);
            }.bind(this));
        },
        defaults: {}
    }, webix.IdSpace, webix.ui.layout);

    //defining such variables helps navigating this component in IDE
    var dashboard_device_filters = webix.protoUI({
        name: 'dashboard_device_filters',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 30,
                        template: "<span class='webix_icon fa-filter'></span><span class='webix_strong'> Device filters</span>"
                    },
                    {
                        view: "textarea",
                        id: "value",
                        value: ""
                    },
                    {
                        view: "button",
                        type: "iconButton",
                        id: "btnSettings",
                        label: "Apply filters to Devices tree",
                        icon: "filter",
                        align: "left",
                        click: function () {
                            //TODO validate
                            var value = this.getTopParentView().$$("value").getValue().split('\n');
                            PlatformContext.user_context.update_attributes({
                                device_filters: value
                            });
                            $$("devices-tree").updateRoot();
                        }
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('value').setValue(PlatformContext.user_context.device_filters.join('\n'))
            }.bind(this));
        },
        defaults: {
            minWidth: 240,
            minHeight: 240,
            on: {
                "user_context.create subscribe": function (event) {
                    event.controller.$$('value').setValue(event.data.device_filters.join('\n'))
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    var dashboard_tango_hosts = webix.protoUI({
        name: 'dashboard_tango_hosts',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        template: "<span class='webix_icon fa-server'></span><span class='webix_strong'> TANGO hosts</span>",
                        height: 40
                    },
                    {
                        view: 'form',
                        height: 60,
                        elements: [
                            {
                                cols: [
                                    {
                                        view: 'text',
                                        id: "new-tango-host",
                                        name: 'new_tango_host',
                                        placeholder: 'localhost:10000',
                                        invalidMessage: "Value does not match pattern: host:port",
                                        validate: function (value) {
                                            return /\w+:\d+/.test(value);
                                        },
                                        suggest: [] //TODO
                                    },
                                    {
                                        view: 'button',
                                        type: 'icon',
                                        icon: 'plus-square-o',
                                        width: 32,
                                        click: function () {
                                            var form = this.getFormView();
                                            var isValid = form.validate();
                                            if (!isValid) return;

                                            UserContext.add_tango_host(form.elements.new_tango_host.getValue());
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        gravity: 6,
                        id: 'tango_hosts',
                        view: 'list',
                        autoheight: true,
                        select: true,
                        template: "<span class='webix_icon fa-minus-square-o remove_tango_host'></span> #id#",
                        on: {
                            onItemClick: function (id) {
                                PlatformContext.tango_hosts.setCursor(id);
                            }
                        },
                        onClick: {
                            remove_tango_host: function (event, id) {
                                UserContext.delete_tango_host(id);
                            }
                        }
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                var data = [];
                var context = PlatformContext.user_context;

                for (var tango_host in context.tango_hosts) {
                    if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                    data.push({
                        id: tango_host
                    });
                }

                $$('dashboard').$$('tango_hosts').parse(data);
            });
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480,
            on: {
                "user_context.create subscribe": function (event) {
                    var data = [];
                    var context = event.data;

                    for (var tango_host in context.tango_hosts) {
                        if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                        data.push({
                            id: tango_host
                        });
                    }

                    $$('dashboard').$$('tango_hosts').parse(data);
                },
                "user_context.add_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').add({
                        id: event.data
                    });
                    var rest = PlatformContext.rest;
                    rest.fetchHost(event.data).then(function (tango_host) {
                        return tango_host.fetchDatabase();
                    }).then(function (db) {
                        TangoWebappHelpers.log(db.device.host.id + " has been added.");
                    });
                },
                "user_context.delete_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').remove(event.data);

                    //TODO do we need to remove tango_host from context here?
                },
                "user_context.destroy subscribe": function () {
                    $$('dashboard').$$('tango_hosts').clearAll();
                    $$('dashboard').$$('tango_hosts').refresh();
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.ui.layout);


    var dashboard_tango_host_info = webix.protoUI({
        name: 'dashboard_tango_host_info',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 40,
                        template: "<span class='webix_icon fa-database'></span><span class='webix_strong'> TANGO host info</span>"
                    },
                    {
                        autoheight: true,
                        id: "tango-host-info-value",
                        template: function (obj, $view) {
                            //TODO see if we can use overlay here
                            if (obj.Class === undefined) return "Please choose TANGO host in the list to view the info";
                            if (obj.is_alive)
                                return "<span class='webix_strong'>" + obj.id + "</span>  is alive!" +
                                    "<hr/><div style='display: block'>" + obj.info.join('<br/>') + "</div>";
                            else
                                return "<span class='webix_icon fa-frown-o'></span><span class='webix_strong'>" + obj.id + "</span>  is not alive!";
                        }
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('tango-host-info-value')
                    .bind(PlatformContext.tango_hosts)
            }.bind(this));
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480,
            on: {
                "platform_context.create subscribe": function (event) {
                    event.controller.$$('tango-host-info-value')
                        .bind(event.data.tango_hosts)
                },
                "platform_context.destroy subscribe": function (event) {
                    event.controller.$$('tango-host-info-value').unbind()
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    var dashboard_device_info = webix.protoUI({
        name: 'dashboard_device_info',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 40,
                        template: "<span class='webix_icon fa-microchip'></span><span class='webix_strong'> TANGO device info</span>"
                    },
                    {
                        autoheight: true,
                        id: "tango-device-info-value",
                        template: function (obj, $view) {
                            if (obj.Class === undefined) return "Please choose TANGO device in the tree to view the info";
                            return new View({url: 'views/device_info.ejs'}).render(obj.info);
                        }
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('tango-device-info-value').bind(PlatformContext.devices);
            }.bind(this));
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480,
            on: {
                "platform_context.create subscribe": function (event) {
                    event.controller.$$('tango-device-info-value')
                        .bind(event.data.devices)
                },
                "platform_context.destroy subscribe": function (event) {
                    event.controller.$$('tango-device-info-value').unbind()
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    //TODO remove dashboard- from ids
    var dashboard = webix.protoUI({
        name: "dashboard",
        _ui: function () {
            return {
                cols: [
                    {
                        minWidth: 20
                    },
                    {
                        rows: [
                            {},
                            getting_started,
                            {
                                height: 5
                            },
                            {
                                id: 'dashboard-device-filters',
                                view: "dashboard_device_filters"
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                view: 'dashboard_tango_hosts',
                                id: 'dashboard-tango-hosts'
                            },
                            {},
                            {
                                view: 'server_wizard',
                                id: 'dashboard-server-wizard'
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                view: 'dashboard_tango_host_info',
                                id: 'tango-host-info'

                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                view: 'dashboard_device_info',
                                id: "tango-device-info"
                            },
                            {}
                        ]
                    },
                    {
                        minWidth: 20
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
        }
    }, webix.IdSpace, webix.ui.layout);
})();


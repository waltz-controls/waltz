//TODO isolate this component
/** @module Settings
 * @memberof ui
 */
(function () {
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.textarea.html webix.ui.textarea}
     * @property {String} name
     * @memberof ui.Settings
     * @namespace textarea0
     */
    var textarea0 = webix.protoUI(
        /** @lends textarea0*/
        {
        name: "textarea0",
        $cssName: "textarea",
            /** @memberof ui.Settings.textarea0 */
        getValue: function () {
            var rv = webix.ui.textarea.prototype.getValue.call(this);
            return rv.split('\n');
        },
            /** @memberof ui.Settings.textarea0 */
        setValue: function (value) {
            webix.ui.textarea.prototype.setValue.call(this, value.join('\n'));
        }
    }, webix.ui.textarea);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.Settings
     * @namespace tango_rest_url
     */
    var tango_rest_url =  webix.protoUI(
        /** @lends tango_rest_url.prototype*/
        {
        name:'tango_rest_url',
        _ui:function(user_context){
            return {
                rows: [
                    {
                        type: 'header',
                        height: 30,
                        template: "<span class='webix_icon fa-server'></span><span class='webix_strong'> Tango REST API URL</span>"
                    },
                    {
                        view: 'form',
                        id: 'frm_tango_rest_url',
                        elements: [
                            {view: 'text', name: 'rest_url', value: ''},
                            {
                                view: 'button', type: 'form', label: 'Apply', click: function () {
                                    var newRestUrl = this.getFormView().elements['rest_url'].getValue();

                                    var tangoRestApi = new TangoRestApi({url: newRestUrl});
                                    PlatformContext.set_rest(tangoRestApi);
                                }
                            }
                        ]
                    }
                ]
            }
        },
        /**
         * @memberof ui.Settings.tango_rest_url
         * @constructor
         */
        $init:function(config){
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                 var context = PlatformContext.UserContext;

                 this.$$('frm_tango_rest_url').elements['rest_url'].setValue(context.rest_url);
            }.bind(this));
        },
        defaults: {
            minWidth: 240,
            on: {
                "platform_context.set_rest subscribe":function(event){
                    this.$$('frm_tango_rest_url').elements['rest_url'].setValue(event.data.UserContext.rest_url);
                }
            }
        }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @class [server_wizard]
     * @property {String} name
     * @memberof ui.Settings
     * @namespace server_wizard
     */
    var server_wizard = webix.protoUI(
        /** @lends server_wizard.prototype */
        {
        name: 'server_wizard',
        /**
         * @param {Object} data
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
            /**
             * @memberof ui.Settings.server_wizard
             * @constructor
             */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('form').elements.tango_host.bind(PlatformContext.tango_hosts);
            }.bind(this));
        },
        defaults: {}
    }, webix.IdSpace, webix.ui.layout);

    //defining such variables helps navigating this component in IDE
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @class [dashboard_device_filters]
     * @property {String} name
     * @memberof ui.Settings
     * @namespace dashboard_device_filters
     */
    var dashboard_device_filters = webix.protoUI(
        /** @lends dashboard_device_filters.prototype */
        {
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
                            PlatformApi.UserContextController().update_attributes({
                                device_filters: value
                            });
                            $$("devices-tree").updateRoot();
                        }
                    }
                ]
            };
        },
            /**
             * @memberof ui.Settings.dashboard_device_filters
             * @constructor
             */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('value').setValue(PlatformContext.UserContext.device_filters.join('\n'))
            }.bind(this));
        },
        defaults: {
            on: {
                "user_context_controller.found subscribe": function (event) {
                    this.$$('value').setValue(event.data.device_filters.join('\n'))
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.Settings
     * @namespace dashboard_tango_hosts
     */
    var dashboard_tango_hosts = webix.protoUI(
        /** @lends dashboard_tango_hosts.prototype*/
        {
        name: 'dashboard_tango_hosts',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        template: "<span class='webix_icon fa-server'></span><span class='webix_strong'> Tango hosts</span>",
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

                                            PlatformApi.UserContextController().add_tango_host(form.elements.new_tango_host.getValue());
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
                                PlatformApi.UserContextController().delete_tango_host(id);
                            }
                        }
                    }
                ]
            };
        },
            /**
             * @memberof ui.Settings.dashboard_tango_hosts
             * @constructor
             */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                var data = [];
                var context = PlatformContext.UserContext;

                for (var tango_host in context.tango_hosts) {
                    if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                    data.push({
                        id: tango_host
                    });
                }

                $$('settings').$$('tango_hosts').parse(data);
            });
        },
        defaults: {
            minWidth: 240,
            on: {
                "user_context_controller.found subscribe": function (event) {
                    var data = [];
                    var context = event.data;

                    for (var tango_host in context.tango_hosts) {
                        if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                        data.push({
                            id: tango_host
                        });
                    }

                    $$('settings').$$('tango_hosts').parse(data);
                },
                "user_context_controller.add_tango_host subscribe": function (event) {
                    $$('settings').$$('tango_hosts').add({
                        id: event.data
                    });
                    var rest = PlatformContext.rest;
                    rest.fetchHost(event.data)
                        .then(function (tango_host) {
                            return tango_host.fetchDatabase();
                        }).then(function (db) {
                        TangoWebappHelpers.log(db.device.host.id + " has been added.");
                    }).fail(function (host) {
                        TangoWebappHelpers.error("Failed to load Tango host[" + host.id + "]");//TODO errors
                    });
                },
                "user_context_controller.delete_tango_host subscribe": function (event) {
                    $$('settings').$$('tango_hosts').remove(event.data);

                    //TODO do we need to remove tango_host from context here?
                },
                "user_context_controller.destroy subscribe": function () {
                    $$('settings').$$('tango_hosts').clearAll();
                    $$('settings').$$('tango_hosts').refresh();
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ui.layout);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.Settings
     * @namespace dashboard_tango_host_info
     */
    var dashboard_tango_host_info = webix.protoUI(
        /** @lends dashboard_tango_host_info.prototype*/
        {
        name: 'dashboard_tango_host_info',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 40,
                        template: "<span class='webix_icon fa-database'></span><span class='webix_strong'> Tango host info</span>"
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
            /**
             * @memberof ui.Settings.dashboard_tango_host_info
             * @constructor
             */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('tango-host-info-value')
                    .bind(PlatformContext.tango_hosts)
            }.bind(this));
        },
        defaults: {
            minWidth: 240,
            on: {
                "platform_api.ui.initialized subscribe": function (event) {
                    this.$$('tango-host-info-value')
                        .bind(event.data.context.tango_hosts)
                },
                "platform_context.destroy subscribe": function (event) {
                    this.$$('tango-host-info-value').unbind()
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    //TODO remove dashboard- from ids
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.Settings
     * @namespace settings
     */
    var settings = webix.protoUI(
        /** @lends settings*/
        {
        name: "settings",
        _ui: function () {
            return {
                cols: [
                    {
                        minWidth: 5
                    },
                    {
                        gravity:3,
                        rows: [
                            {},
                            {
                                view: 'tango_rest_url'
                            },
                            {
                                minHeight: 5
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
                        gravity:3,
                        rows: [
                            {},
                            {
                                view: 'dashboard_tango_hosts',
                                id: 'dashboard-tango-hosts'
                            },
                            {
                                minHeight: 5
                            },
                            {
                                view: 'server_wizard',
                                id: 'dashboard-server-wizard'
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        gravity: 3,
                        rows: [
                            {},
                            {

                                view: 'dashboard_tango_host_info',
                                id: 'tango-host-info'
                            },
                            {}
                        ]

                    },
                    {
                        minWidth: 5
                    }
                ]
            };
        },
        /**
         * @memberof ui.Settings.settings
         * @constructor
         */
        $init: function (config) {
            webix.extend(config, this._ui());
        }
    }, webix.IdSpace, webix.ui.layout);

    //TODO export
    TangoWebapp.ui.newSettingsTab = function(){
        return {
            header: "<span class='webix_icon fa-gears'></span> Settings",
            close : true,
            body:
                {
                    id: 'settings',
                    view: "settings"
                }
        }
    }
})();


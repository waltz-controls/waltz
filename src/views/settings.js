//TODO isolate this component
/** @module Settings
 * @memberof ui
 */
import {kUserContext} from "controllers/user_context";
import {kWidgetSettings} from "widgets/settings";

const kTangoHostsHeader = "<span class='webix_icon mdi mdi-server'></span><span class='webix_strong'>Tango hosts</span>";
const kDeviceFiltersHeader = "<span class='webix_icon mdi mdi-filter'></span><span class='webix_strong'>Device filters</span>";
const kRemoveTangoHost = "<span class='webix_icon wxi-minus-square remove_tango_host'></span> #id#";
export const kSettingsHeaderCogs = "<span class='webix_icon mdi mdi-cogs'></span> Settings";


/**
 * Extends {@link https://docs.webix.com/api__refs__ui.textarea.html webix.ui.textarea}
 * @property {String} name
 * @memberof ui.Settings
 * @namespace textarea0
 */
const textarea0 = webix.protoUI(
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
 * @class [server_wizard]
 * @property {String} name
 * @memberof ui.Settings
 * @namespace server_wizard
 */
const server_wizard = webix.protoUI(
    /** @lends server_wizard.prototype */
    {
    name: 'server_wizard',
    /**
     * @param {Object} data
     * @private
     */
    _create_devices: function (data) {
        webix.promise.all(
            data.values.devices.map(function (name) {
                OpenAjax.hub.publish("tango_webapp.device_add", {
                    data: {
                        device: {
                            server: data.values.server,
                            name,
                            clazz: data.values.className
                        },
                        host: TangoHost.find_one(data.host)
                    }
                });
            })
        );
    },
    ui: function () {
        return {
            rows: [
                {
                    type: 'header',
                    height: 30,
                    template: "<span class='webix_icon mdi mdi-auto-fix'></span><span class='webix_strong'> Tango" +
                        " Server Wizard</span>"
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
        webix.extend(config, this.ui());

        this.$ready.push(async () => {
            const context = await config.app.getContext(kUserContext);
            this.$$('form').elements.tango_host.parse(context.getTangoHosts());
        });
    }
}, webix.IdSpace, webix.ui.layout);

//defining such variables helps navigating this component in IDE
/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @class [dashboard_device_filters]
 * @property {String} name
 * @memberof ui.Settings
 * @namespace dashboard_device_filters
 */
const dashboard_device_filters = webix.protoUI(
    /** @lends dashboard_device_filters.prototype */
    {
    name: 'dashboard_device_filters',
    ui() {
        return {
            rows: [
                {
                    type: 'header',
                    template: kDeviceFiltersHeader
                },
                {
                    view: "textarea",
                    id: "value",
                    value: ""
                },
                {
                    view: "icon",
                    id: "btnSettings",
                    label: "Apply filters to Devices tree",
                    icon: "mdi mdi-filter",
                    align: "left",
                    click: function () {
                        //TODO validate
                        const value = this.getTopParentView().$$("value").getValue().split('\n');
                        PlatformApi.UserContextController().update_attributes({
                            device_filters: value
                        });
                        $$('devices_tree').tree.updateRoot();
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
        webix.extend(config, this.ui());

        this.$ready.push(async () => {
            const context = await config.app.getContext(kUserContext);
            this.$$('value').setValue(context.device_filters.join('\n'))
        });
    }
},webix.IdSpace, webix.ui.layout);

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @property {String} name
 * @memberof ui.Settings
 * @namespace dashboard_tango_hosts
 */
const dashboard_tango_hosts = webix.protoUI(
    /** @lends dashboard_tango_hosts.prototype*/
    {
    name: 'dashboard_tango_hosts',
    ui(config) {

        return {
            rows: [
                {
                    type: 'header',
                    template: kTangoHostsHeader,
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
                                    view: 'icon',
                                    icon: 'wxi-plus-square',
                                    click: function () {
                                        const form = this.getFormView();
                                        if (!form.validate()) return;

                                        config.root.addTangoHost(form.elements.new_tango_host.getValue());
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
                    template: kRemoveTangoHost,
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
        webix.extend(config, this.ui(config));

        this.$ready.push(async () => {
            const context = await config.root.app.getContext(kUserContext);
            $$(kWidgetSettings).$$('tango_hosts').parse(context.getTangoHosts().map(host => ({id:host, value: host})));
        });
    },
    defaults: {
        minWidth: 240,
        on: {
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
}, webix.ui.layout);

//TODO remove dashboard- from ids
/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @property {String} name
 * @memberof ui.Settings
 * @namespace settings
 */
const settings = webix.protoUI(
    /** @lends settings*/
    {
    name: "settings",
    ui({root}) {
        return {
            borderless: true,
            type: 'space',
            cols: [
                {
                    minWidth: 5
                },
                {
                    gravity:3,
                    rows: [
                        {},
                        {
                            view: 'dashboard_tango_hosts',
                            id: 'dashboard-tango-hosts',
                            root
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
                            minWidth: 240,
                            id: 'dashboard-device-filters',
                            view: "dashboard_device_filters",
                            root
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
                            view: 'server_wizard',
                            id: 'dashboard-server-wizard',
                            root
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
        webix.extend(config, this.ui({...config}));
    }
}, webix.IdSpace, webix.ui.layout);

/** @module DevicesTree
 *  @memberof ui
 */
import {TangoId} from "@waltz-controls/tango-rest-client";
import {WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @class [dashboard_device_filters]
 * @property {String} name
 * @memberof ui.Settings
 * @namespace dashboard_device_filters
 */
const device_filters = webix.protoUI(
    /** @lends dashboard_device_filters.prototype */
    {
        name: 'device_filters',
        ui(config) {
            return {
                rows: [
                    {
                        view: 'form',
                        elements:[{
                            view: "textarea",
                            id: "value",
                            value: ""
                        },
                            {
                                view: "button",
                                id: "btnSettings",
                                type:'icon',
                                label: "Apply device filters...",
                                icon: "mdi mdi-filter",
                                align: "left",
                                click() {
                                    const value = this.getTopParentView().$$("value").getValue().split('\n');

                                    //TODO validate
                                    config.root.applyDeviceFilters(value)
                                }
                            }]
                    }

                ]
            };
        },
        /**
         * @memberof ui.Settings.dashboard_device_filters
         * @constructor
         */
        $init: function (config) {
            webix.extend(config, this.ui(config));

            this.$ready.push(async () => {
                const context = await this.getUserContext();
                this.$$('value').setValue(context.device_filters.join('\n'))
            });
        }
    },WaltzWidgetMixin, webix.IdSpace, webix.ui.layout);

const kRemoveTangoHost = "<span class='webix_icon wxi-minus-square remove_tango_host'></span> #id#";

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @property {String} name
 * @memberof ui.Settings
 * @namespace dashboard_tango_hosts
 */
const tango_hosts = webix.protoUI(
    /** @lends dashboard_tango_hosts.prototype*/
    {
        name: 'tango_hosts',
        ui(config) {

            return {
                rows: [
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
                        id: 'list',
                        view: 'list',
                        autoheight: true,
                        select: true,
                        template: kRemoveTangoHost,
                        on: {
                            onItemClick: function (id) {
                                config.root.selectHost(TangoId.fromTangoHost(id));
                            }
                        },
                        onClick: {
                            remove_tango_host: function (event, id) {
                                config.root.removeTangoHost(id);
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
                $$(config.root.name).$$("tango_hosts").$$('list').sync(config.root.tango_hosts);
            });
        }
    }, WaltzWidgetMixin, webix.IdSpace, webix.ui.layout);

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
const wizard = webix.protoUI(
    /** @lends server_wizard.prototype */
    {
        name: 'wizard',
        /**
         * @param {Object} config
         * @private
         */
        ui(config) {
            return {
                rows: [
                    {
                        view: 'form',
                        id: 'form',
                        elements: [
                            {
                                view: 'richselect',
                                name: 'tango_host',
                                label: "Tango host:",
                                labelWidth: 150,
                                labelPosition: "top",
                                placeholder: 'select in Tango hosts',
                                validate: webix.rules.isNotEmpty,
                                invalidMessage: "Tango host must be set",
                                options:[]
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
                                    let rv = false;
                                    do {
                                        rv = /[\w]*\/[\w]*\/[\w]*/.test(value.shift());
                                    } while (rv && value.length);
                                    return rv;
                                }, invalidMessage: "Incorrect devices"
                            },
                            {
                                view: 'button',
                                type: 'form',
                                value: 'Create new Tango devices...',
                                click() {
                                    const form = this.getFormView();
                                    if (!form.validate()) return;

                                    config.root.addTangoDevices({
                                        host: form.elements.tango_host.data.value,
                                        ...form.getValues()
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
            webix.extend(config, this.ui(config));

            this.$ready.push(async () => {
                this.$$('form').elements.tango_host.getPopup().getList()
                    .sync(config.root.tango_hosts);
            });
        }
    }, webix.IdSpace, webix.ui.layout);

/**
 * @constant
 * @memberof ui.DevicesTree
 */
const tree_context_menu = {
    view: "contextmenu",
    id: "devices_tree_context_menu",
    data: [
        {id: 'configure', value: 'Configure'},
        {id: 'view', value: 'Monitor'}
    ],
    on: {
        /**
         * @event tango_webapp.device_configure
         * @property {{device:TangoDevice}} data
         * @type {OpenAjax}
         * @memberof ui
         */
        /**
         * @event tango_webapp.device_monitor
         * @property {{device:TangoDevice}} data
         * @type {OpenAjax}
         * @memberof ui
         */
        /**
         * @event tango_webapp.device_delete
         * @property {{device:TangoDevice}} data
         * @type {OpenAjax}
         * @memberof ui
         */
        /**
         * Fires {@link #uieventtango_webappdevice_configure event:device_configure}
         *
         * Fires {@link #uieventtango_webappdevice_monitor event:device_monitor}
         *
         * Fires {@link #uieventtango_webappdevice_delete event:device_delete}
         *
         *
         * @fires event:device_configure
         * @fires event:device_monitor
         * @fires event:device_delete
         * @param id
         * @memberof ui.DevicesTree.tree_context_menu
         */
        onItemClick: function (id) {
            var tree = this.config.master;
            var item = tree.getItem(this.getContext().id);

            var tango_host = TangoHost.find_one(tree._get_tango_host_id(item));

            tango_host.fetchDevice(item.device_name).then(function (device) {
                OpenAjax.hub.publish("tango_webapp.device_" + id, {
                    data: {
                        device: device
                    }
                });
            })
        }
    }
};

/**
 * @extends webix.ui.tree
 * @see {@link https://docs.webix.com/api__refs__ui.tree.html webix.ui.tree}
 * @property {String} name
 * @property devices_filter
 * @memberof ui.DevicesTree
 * @namespace tree
 */
const devices_tree = webix.protoUI(
/** @lends  tree.prototype */
{
    devices_filter: null,
    name: 'devices_tree',
    /**
     * @memberof ui.DevicesTree.tree.prototype
     * @constructor
     */
    $init: function (config) {
        webix.ui(tree_context_menu).attachTo(this);
    },
    getTangoHostId: function (item) {
        while (item.$css !== 'tango_host') {
            item = this.getItem(item.$parent)
        }
        return TangoId.fromTangoHost(item.id);
    },
    defaults: {
        type: {
            folder(obj){
                switch(obj.$css){
                    case "tango_host":
                        return "<span class='webix_icon mdi mdi-database'> </span>";
                    case "aliases":
                        return `<span class='webix_icon mdi mdi-${obj.$count > 0 ? "link": "crop-square"}'> </span>`;
                    case "tango_domain":
                    case "tango_family":
                        return `<span class='webix_icon mdi mdi-folder${obj.open ? "-open" : ""}'> </span>`;
                    case "member":
                        return "<span class='webix_icon mdi mdi-developer-board'> </span>";
                }
                return "";
            }
        },
        select: true,
        activeTitle:true,
        drag: "source",
        on: {
            onItemClick(id) {
                if(this.getSelectedId() === id)
                    this.callEvent("onAfterSelect",[id]);
            },
            /**
             * Event listener.
             * @memberof ui.DevicesTree.tree
             */
            onBeforeContextMenu: function (id, e, node) {
                const item = this.getItem(id);
                if (item.isAlias || item.isMember) {
                    this.$$("devices_tree_context_menu").config.master = this;
                    this.select(id);
                    return true;
                }
                return false;
            },
            /**
             * Event listener.
             * @memberof ui.DevicesTree.tree
             */
            onItemDblClick: function (id) {
                const item = this.getItem(id);
                if (!item) return false;//TODO or true

                if (item.isAlias || item.isMember) {
                    this.config.root.openDeviceControlPanel();
                }
            },
            /**
             * Event listener.Happens after click event
             *
             * Sets tango host cursor. If alias or member is clicked fetches device.
             *
             * @param id
             * @return {boolean}
             * @memberof ui.DevicesTree.tree
             */
            async onAfterSelect(id) {
                const item = this.getItem(id);
                if (!item) return false;//TODO or true
                const tangoHostId = this.getTangoHostId(item);
                this.config.root.selectHost(tangoHostId)

                if ((item.isAlias && item.device_name !== undefined) || item.isMember) {
                    this.config.root.selectDevice(TangoId.fromDeviceId(`${tangoHostId.getTangoHostId()}/${item.device_name}`))
                } else if (item.isAlias && item.device_name === undefined) {
                    this.config.root.selectDeviceByAlias(item.value)
                } else {
                    this.config.root.selectDatabase(tangoHostId);
                }
            }
        }
    }
}, webix.ProgressBar, webix.IdSpace, webix.EventSystem, webix.ui.tree);
/** @module DevicesTree
 *  @memberof ui
 */
import {TangoId} from "@waltz-controls/tango-rest-client";

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
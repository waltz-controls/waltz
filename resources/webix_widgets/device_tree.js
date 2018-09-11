/**
 * @deprecated DeviceViewPanel is used instead
 * @module DeviceTree
 * @memberof ui
 */
(function () {
    /**
     * @constant
     * @memberof ui.DeviceTree
     */
    var header = "<span class='webix_icon fa-microchip'></span> Device: ";
    /**
     * @constant
     * @memberof ui.DeviceTree
     */
    var device_info = [
        "name",
        "admin",
        "device_class",
        "exported",
        "host",
        "idl",
        "pid",
        "started_at",
        "stopped_at"
    ];
    /**
     * @constant
     * @memberof ui.DeviceTree
     */
    var context_menu = {
        view: "contextmenu",
        //autoheight: true,
        id: 'attrs-menu',
        data: [
            {id: 'add_to_monitor', value: 'Add to monitor'}
        ],
        on: {
            onItemClick: function (id) {
                var tree = this.config.master;
                var item = tree.getItem(this.getContext().id);
                var parent = tree.getItem(item.$parent);
                OpenAjax.hub.publish("tango_webapp.attr_" + id, {
                    data: parent.values.getItem(item.id)
                });
            }
        }
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.tree.html webix.ui.tree}
     * @property {String} name
     * @memberof ui.DeviceTree
     * @namespace device_tree
     */
    var device_tree = webix.protoUI(
        {
        name: 'device_tree',
        /**
         * @constructor
         * @memberof ui.DeviceTree.device_tree
         */
        $init: function (config) {
            this.$ready.push(function () {
                this.bind(config.context.devices)
            }.bind(this));

            webix.ui(context_menu).attachTo(this);
        },
        _update_header: function (device) {
            $$("device_tree").config.header = webix.template(function () {
                return header + device.display_name;
            });
            $$("device_tree").refresh();
        },
        /**
         *
         * @param {TangoDevice} device
         * @returns {Array}
         * @private
         */
        _get_device_info:function(device){
            var result = [];

            result.push({
                id: 'alias',
                value: "Display name : " + device.display_name,
                $css:  'INFO'
            });

            device_info.forEach(function(item){
                result.push({
                    id: item,
                    value: MVC.String.classize(item) + " : " + device.info[item],
                    $css:  'INFO'
                })
            });

            return result;
        },
        defaults: {
            select: true,
            on: {
                onBeforeSelect:function(id){
                    return id !== 'info' && this.getItem(id).$parent !== 'info';
                },
                onAfterSelect:function(id){
                    if(id === 'attrs' || id === 'commands' || id === 'pipes') return;
                    OpenAjax.hub.publish("tango_webapp.item_selected", {
                        data: {
                            id: id,
                            kind: this.getItem(id).$parent
                        }
                    });
                },
                onBeforeContextMenu: function(id){
                    //TODO API
                    if(this.getItem(id).$parent === 'attrs'){
                        this.select(id);
                        this.$$("attrs-menu").config.master = this;
                        return true;
                    }
                    return false;
                },
                onBindApply: function (obj) {
                    if (obj.id === undefined) return false;

                    this._update_header(obj);

                    var info = this._get_device_info(obj);

                    this.clearAll();
                    this.parse({
                        id: 'root',
                        open:true,
                        data: [
                            {
                                id:'info',
                                value: 'info',
                                open: true,
                                data: info,
                                $css:  'info_folder'
                            },
                            {
                                id: 'attrs',
                                value: 'attributes',
                                webix_kids: true,
                                device: obj,
                                values: obj.attrs,
                                open: obj.attrs.count() > 0
                            },
                            {
                                id: 'commands',
                                value: 'commands',
                                webix_kids: true,
                                device: obj,
                                values: obj.commands,
                                open: obj.commands.count() > 0
                            },
                            {
                                id: 'pipes',
                                value: 'pipes',
                                webix_kids: true,
                                device: obj,
                                values: obj.pipes,
                                open: obj.pipes.count() > 0
                            }
                        ]
                    });
                },
                onDataRequest: function (id) {
                    if(id === 'info') return true;
                    var item = this.getItem(id);
                    if(item.$level !== 1) return false;
                    item.device['fetch' + MVC.String.classize(id)]().then(function(items){
                        this.parse({
                            parent: id,
                            data: items.map(function(item){
                                return {
                                    id: item.id,
                                    value: item.display_name,
                                    $css:  item.getDataFormat()
                                }
                            })
                        })
                    }.bind(this));
                    return false;
                }
            }
        }
    }, webix.IdSpace, webix.ui.tree);
    /**
     * @param context
     * @memberof ui.DeviceTree
     */
    TangoWebapp.ui.newDeviceTree = function (context) {
        return {
            header: header,
            id: 'device_tree',
            body: {
                context: context,
                view: 'device_tree'
            }
        }
    }

})();
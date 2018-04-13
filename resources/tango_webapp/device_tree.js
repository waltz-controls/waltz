/**
 *
 * @module DeviceTree
 */
(function () {
    var header = "<span class='webix_icon fa-microchip'></span> Device: ";

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
     * @type {webix.protoUI}
     */
    var device_tree = webix.protoUI({
        name: 'device_tree',
        $init: function (config) {
            this.$ready.push(function () {
                this.bind(config.context.devices)
            }.bind(this));

            webix.ui(context_menu).attachTo(this);
        },
        _update_header: function (device) {
            $$("device_tree").config.header = webix.template(function () {
                return header + device.alias + "(" + device.name + ")";
            });
            $$("device_tree").refresh();
        },
        defaults: {
            select: true,
            on: {
                onAfterSelect:function(id){
                    if(id === 'attrs' || id === 'commands' || id === 'pipes') return;
                    OpenAjax.hub.publish("tango_webapp.item_selected", {
                        data: {
                            id: id,
                            kind: this.getItem(id).$parent,
                            values: this.getItem(this.getItem(id).$parent).values
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

                    this.clearAll();
                    this.parse({
                        id: 'root',
                        open:true,
                        data: [
                            {
                                id: 'attrs',
                                value: 'attributes',
                                webix_kids: true,
                                device: obj,
                                values: obj.attrs
                            },
                            {
                                id: 'commands',
                                value: 'commands',
                                webix_kids: true,
                                device: obj,
                                values: obj.commands
                            },
                            {
                                id: 'pipes',
                                value: 'pipes',
                                webix_kids: true,
                                device: obj,
                                values: obj.pipes
                            }
                        ]
                    });

                    //TODO if device.attrs.count() > 0 continue loading
                },
                onDataRequest: function (id) {
                    var item = this.getItem(id);
                    if(item.$level !== 1) return false;
                    item.device['fetch' + MVC.String.classize(id)]().then(function(items){
                        this.parse({
                            parent: id,
                            data: items.map(function(item){
                                return MVC.Object.extend(item, {
                                    value: item.name
                                })
                            })
                        })
                    }.bind(this));
                    return false;
                }
            }
        }
    }, webix.IdSpace, webix.ui.tree);

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
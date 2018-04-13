/**
 *
 * @module DeviceTree
 */
(function () {
    var header = "<span class='webix_icon fa-microchip'></span> Device: ";

    /**
     * @type {webix.protoUI}
     */
    var device_tree = webix.protoUI({
        name: 'device_tree',
        $init: function (config) {
            this.$ready.push(function () {
                this.bind(config.context.devices)
            }.bind(this));

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
                onBindApply: function (obj) {
                    if (obj.id === undefined) return false;

                    this._update_header(obj);

                    this.clearAll();
                    this.parse({
                        id: 'root',
                        open:true,
                        data: [
                            {
                                id: 'Attrs',
                                value: 'attributes',
                                webix_kids: true,
                                device: obj
                            },
                            {
                                id: 'Commands',
                                value: 'commands',
                                webix_kids: true,
                                device: obj
                            },
                            {
                                id: 'Pipes',
                                value: 'pipes',
                                webix_kids: true,
                                device: obj
                            }
                        ]
                    });

                    //TODO if device.attrs.count() > 0 continue loading
                },
                onDataRequest: function (id) {
                    var item = this.getItem(id);
                    if(item.$level !== 1) return false;
                    item.device['fetch' + id]().then(function(items){
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
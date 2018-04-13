/**
 *
 * @module DeviceTree
 */
(function(){
    var header = "<span class='webix_icon fa-microchip'></span> Device";

    var device_tree = webix.protoUI({
        name: 'device_tree',
        $init:function(config){
            this.$ready.push(function(){
                this.bind(config.context.devices)
            }.bind(this));

        },
        _update_header:function(device){
            $$("device_tree").config.header= webix.template(function(){
                return header + " " + device.alias + "(" + device.name + ")";
            });
            $$("device_tree").refresh();
        },
        defaults:{
            on: {
                onBindApply:function(obj){
                    if(obj.id === undefined) return false;

                    this._update_header(obj);

                    this.clearAll();
                    this.parse({
                        id: 'root',
                        device: obj,
                        open:true,
                        data: [
                                {
                                    id: 'attributes',
                                    value: 'attributes',
                                    webix_kids: true
                                },
                                {
                                    id: 'commands',
                                    value: 'commands',
                                    webix_kids: true
                                },
                                {
                                    id: 'pipes',
                                    value: 'pipes',
                                    webix_kids: true
                                }
                            ]
                    });
                }
            }
        }
    },webix.IdSpace,webix.ui.tree);

    TangoWebapp.ui.newDeviceTree = function(context){
        return {
            header: header,
            id:'device_tree',
            body: {
                context: context,
                view: 'device_tree'
            }
        }
    }

})();
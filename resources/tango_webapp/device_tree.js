/**
 *
 * @module DeviceTree
 */
(function(){
    var device_tree = webix.protoUI({
        name: 'device_tree',
        $init:function(config){
            this.$ready.push(function(){
                this.bind(config.context.devices)
            }.bind(this));

        },
        defaults:{
            on: {
                onBindApply:function(obj){
                    if(obj.id === undefined) return false;
                    this.clearAll();
                    this.parse({
                        id: 'root',
                        device: obj,
                        open:true,
                        data: {
                            value: obj.alias + "(" + obj.name + ")",
                            id: obj.id,
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
                        }
                    });
                }
            }
        }
    },webix.IdSpace,webix.ui.tree);
})();
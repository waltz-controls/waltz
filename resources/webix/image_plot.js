webix.protoUI({
    name: 'Image',
    getBody:function(config){
        return {
            body:{
                template:function(){
                    return "<img width='512px' height='512px' src='"+config.data +"'/>";
                }
            }
        }
    },
    $init: function(config){
        webix.extend(config, this.getBody(config));
        this.$ready.push(function(){
            this.getHead().setValues({name:config.name});
            this.resize();
        });
    },
    defaults:{
        move: true,
        head: {template: 'Plot attribute [#name#]'},
        width: 512,
        height: 600
    }
}, webix.IdSpace, webix.ui.window);
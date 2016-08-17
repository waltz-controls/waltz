webix.protoUI({
    value: "",
    name: "Image",
    update:function(value){
        this.setValues({value: value});
    },
    $init: function(config){
        this.$ready.push(this.setValues.bind(this, config));
    },
    defaults: {
        template:"<img width='512px' height='512px' src='#value#' />"
    }
},webix.IdSpace, webix.ui.template);

TangoWebapp.ui.newImageView = function(config){
    return webix.extend({
        view: "Image"
    }, config);
};
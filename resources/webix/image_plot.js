webix.protoUI({
    src: "",
    name: "Image",
    update:function(value){
        this.setValues({src: value});
    },
    defaults: {
        template:"<img width='512px' height='512px' src='#src#' />"
    }
},webix.IdSpace, webix.ui.template);

TangoWebapp.ui.newImageView = function(config){
    return webix.extend({
        view: "Image"
    }, config);
};
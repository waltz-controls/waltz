TangoWebapp.ui.newImageView = function(config){
    return webix.extend({
        view: "template",
        template:function(){
            return "<img width='512px' height='512px' src='"+config.data +"' />";
        }
    }, config);
};
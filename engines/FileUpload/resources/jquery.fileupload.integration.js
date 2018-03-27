/**
 * This script replaces needed by default for fileupload tmpl plugin with JavaScriptMVC views.
 *
 * @author Ingvord
 */
(function(){
window.tmpl = function(alias){
    return function(params){
        var proxy = new FileUploadController();
        proxy.data = params;//{files:Array,options:fileupload.options,formatFileSize:function}

        return proxy.render({action:alias});
    };
};
})();
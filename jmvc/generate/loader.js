load('jmvc/rhino/compression/env.js');
if(typeof MVC == 'undefined')
    MVC ={ Included: {} };
else
    MVC.Included = {};
var window = this;
var self = window;
include = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        arguments[i]();
    }
}
include.get_env = function(){
    return 'development'
}

//TODO types should be defined in MVC according to existing plugins
MVC.gModelTypes = ["ajax", "cookie", "json_p", "json_rest", "xml_rest"];

load('jmvc/plugins/lang/standard_helpers.js');
load('jmvc/plugins/lang/json/json.js');
load('jmvc/plugins/lang/inflector/inflector.js');
load('jmvc/plugins/view/view.js');

MVC.Ajax = {factory: function(){ return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();}}
include.request = function(path){
    var request = MVC.Ajax.factory();
    request.open("GET", path, false);
    try{request.send(null);}
    catch(e){return null;}
    if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
    return request.responseText;
};

MVCOptions = {};
load('jmvc/rhino/compression/helpers.js');
load('jmvc/rhino/command/parse.js');
load('jmvc/rhino/command/templates/application_helpers.js');

var first = true;
render_to = function(file, ejs, data){
    var v = new View({absolute_url: ejs });

    MVCOptions.save(file,  v.render(data)  );

    print( (first ? "Generating ...":"              ") + " "+file);

    first = false;
};

load('jmvc/generate/app_json.js');
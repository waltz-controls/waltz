include.namespace = function(namespace){
    include.app().namespace = namespace;
};

include.css = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().stylesheets,arguments[i]))
            include.app().stylesheets.push(arguments[i]);
    }
}

include.engines = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().engines,arguments[i]))
            include.app().engines.push(arguments[i]);
    }
}

include.resources = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().resources,arguments[i]))
            include.app().resources.push(arguments[i]);
    }
}

include.plugins = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().plugins,arguments[i]))
            include.app().plugins.push(arguments[i]);
    }
}

include.models = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().models,arguments[i]))
            include.app().models.push(arguments[i]);
    }
}

include.controllers = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().controllers,arguments[i]))
            include.app().controllers.push(arguments[i]);
    }
}

include.views = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().views,arguments[i]))
            include.app().views.push(arguments[i]);
    }
}

include.unit_tests = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().tests.unit,arguments[i]))
            include.app().tests.unit.push(arguments[i]);
    }
}
include.functional_tests = function(){
    for(var i = 0, size = arguments.length;i<size;++i){
        if(!MVC.Array.include(include.app().tests.functional,arguments[i]))
            include.app().tests.functional.push(arguments[i]);
    }
}

/**
 * Creates an empty structure of the app
 *
 * @param app_name
 * @returns {{name: *, tests: {unit: Array, functional: Array}}}
 */
create_app = function(app_name){
    var app = {
        name: app_name,
        namespace: MVC.String.classize(app_name),
        stylesheets: [],
        libs:[],
        engines: [],
        resources: [],
        plugins: ["controller","view","model"],
        models: [],
        controllers:[app_name+"/main"],
        views:[],
        tests: {
            unit: [],
            functional: []
        }
    };
    include.app = function(){
        return app;
    };
    return app;
}

/**
 * Reads {app_name}.js, and {app_name}/test.js and constructs include.app
 *
 * @param app_name
 * @return {JSON} include.app -- json structure of the app
 */
load_app = function(app_name){
    var app = create_app(app_name);
    if(MVCOptions.exists('apps/' + app_name + '.js')) {
        load('apps/' + app_name + '.js')
    } else throw "App " + app_name + " does not exist";

    if(MVCOptions.exists('apps/' + app_name + '/test.js')) {
        load('apps/' + app_name + '/test.js')
    } else throw "App " + app_name + " does not exist";

    return app;
};

save_app = function(app){
    render_to("apps/"+app.name+".js", "jmvc/rhino/command/templates/application.ejs", app);
    print("               Done.\n")
    render_to("apps/"+app.name+"/test.js", "jmvc/rhino/command/templates/test.ejs", app);
    print("               Done.\n")
};
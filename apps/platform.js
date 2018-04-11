/**
 *
 * @namespace
 */
TangoWebappPlatform = {};

include(function () { //runs after prior includes are loaded
    include.plugins(
        "controller", "view", "model"
    );

    //use constant defaults if not in production
    if(include.get_env().match(/development|test/)){
        include.resources("platform/defaults")
    }

    if(MVC.Browser.Rhino){
        include("../build/tmp/resources/constants") //ant  -copy-constants output
    } else {
        include.resources("constants")
    }

    include.resources(
        "platform/webix/tango_mixins",
        "platform/helpers"
    );

    include.models(
        "platform/data_collection_wrapper",
        "platform/tango_webapp_storage", "platform/tango_remote_storage",
        "platform/tango_rest_api_request", "platform/tango_host", "platform/tango_device", "platform/tango_admin_device", "platform/tango_database",
        "platform/tango_command", "platform/tango_attribute", "platform/tango_pipe", "platform/tango_device_property",
        "platform/tango_rest_api",
        "platform/user_context", "platform/platform_context",
        "platform/ui_builder", "platform/platform_api"
    );
    include.controllers(
        "platform/login", "platform/main", "platform/user_context",
        "platform/ui/top_toolbar", "platform/ui/bottom_toolbar", "platform/ui/ui"
    );
    // include.views(
    // );

    if (include.get_env().match(/test/)) {


        include.unit_tests(
            "platform/tango_rest_api_request",
            "platform/tango_device", "platform/tango_database",
            "platform/tango_rest_api",
            "platform/user_context",
            "platform/tango_mixins",
            "platform/tango_webapp_storage"
        )
    }
});

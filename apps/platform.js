/**
 * @namespace TangoWebappPlatform
 */
TangoWebappPlatform = {};

TangoWebapp = {
    /**
     * @namespace ui
     */
    ui : {}
};

include.plugins(
    "controller", "view", "model"
);

include(function () { //runs after prior includes are loaded
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
        "platform/data_collection_wrapper","platform/webix_data_collection_storage",
        "platform/tango_webapp_storage", "platform/tango_remote_storage","platform/user_context_storage","platform/widget_state",
        "platform/tango_rest_api_request", "platform/tango_host","platform/tango_device_alias","platform/tango_domain","platform/tango_family","platform/tango_member",
        "platform/tango_device", "platform/tango_admin_device", "platform/tango_database",
        "platform/tango_command", "platform/tango_attribute", "platform/tango_pipe", "platform/tango_device_property",
        "platform/tango_rest_api",
        "platform/user_context", "platform/platform_context",
        "platform/ui_builder", "platform/platform_api"
    );
    include.controllers(
        "platform/login", "platform/main", "platform/user_context",
        "platform/ui/ui"
    );
    include.views(
        "views/main_log_item", "views/dev_panel_error_out",
        "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );

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

/**
 *
 * @namespace
 */
TangoWebapp.platform = {};

include(function () { //runs after prior includes are loaded
    include.plugins(
        "controller", "view", "model"
    );

    include.resources(
        "platform/webix/tango_mixins",
        "platform/helpers"
    );

    include.models(
        "platform/data_collection_wrapper", "platform/tango_webapp_storage",
        "platform/tango_rest_api_request", "platform/tango_host", "platform/tango_device", "platform/tango_admin_device", "platform/tango_database",
        "platform/tango_command", "platform/tango_attribute", "platform/tango_pipe", "platform/tango_device_property",
        "platform/tango_rest_api",
        "platform/user_context", "platform/platform_context"
    );
    include.controllers(
        "platform/login", "platform/main", "platform/user_context",
        "platform/ui/top_toolbar", "platform/ui/bottom_toolbar"
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

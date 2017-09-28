/**
 *
 * @namespace
 */
TangoWebapp.platform = {};

include(function () { //runs after prior includes are loaded
    include.resources(
        "platform/webix/tango_mixins",
        "platform/helpers"
    );

    include.models(
        "platform/data_collection_wrapper", "platform/tango_webapp_storage",
        "platform/tango_rest_api_request", "platform/tango_host", "platform/tango_device", "platform/tango_database",
        "platform/tango_command",
        "platform/tango_rest_api",
        "platform/user_context", "platform/platform_context"
    );
    include.controllers(
        "platform/login", "platform/main",
        "platform/ui/top_toolbar", "platform/ui/bottom_toolbar"
    );
    // include.views(
    // );

    if (include.get_env().match(/test/)) {
        include('../test/setup');

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

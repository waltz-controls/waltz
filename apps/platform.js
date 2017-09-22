include(function () { //runs after prior includes are loaded
    include.models(
        "platform/data_collection_wrapper",
        "platform/tango_rest_api_request", "platform/tango_host", "platform/tango_device",
        "platform/tango_rest_api"
    );
    // include.controllers(
    // );
    // include.views(
    // );

    if (include.get_env().match(/test/)) {
        include.unit_tests(
            "platform/tango_rest_api_request",
            "platform/tango_device",
            "platform/tango_rest_api"
        )
    }
});
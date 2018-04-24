include("platform");

include.application('TangoWebapp', '0.3-rc9');

include.css(
    "tango_webapp"
    // "webix/codebase/skins/aircompact"
);
include.libs(
    //"webix/codebase/webix_debug"
);
include.resources(
    "tango_webapp/customize_platform"
);
include.engines(
);
include.plugins(
);

include(function () { //runs after prior includes are loaded
    include.models(
        "tango_webapp/device_filter", "tango_webapp/user_action"
    );
    include.controllers(
        "tango_webapp/main", "tango_webapp/user_action"
    );
    include.views(
        "views/main_log_item", "views/getting_started", "views/dev_panel_error_out",
        "views/device_info", "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    //webix widgets
    include.resources(
        "tango_webapp/setup"
    );
});
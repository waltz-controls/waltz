include.application('TangoWebapp', '0.2-rc3');
include.css(
    "highlight"
    // "webix/codebase/skins/aircompact"
);
include.libs(
    //"webix/codebase/webix_debug"
);
include.resources(
    "tango_consts", "tango_helpers"
);
include.engines(
);
include.plugins(
    "controller", "view", "model", "model/cookie"
);

include("platform");

include(function () { //runs after prior includes are loaded
    include.models(
        // "data_base_device", "device", "dserver", "rest_api", "tango_host", "globals", "credentials",
        "tango_webapp/device_filter"
    );
    include.controllers(
        "tango_webapp/main"
    );
    include.views(
        "views/main_log_item",
        "views/getting_started",
        "views/device_info", "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    include.resources(
        "tango_ui", "tango_webapp/setup"
    );
});
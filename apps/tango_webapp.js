include.application('TangoWebapp', '0.2-rc3');
include.css(
    "highlight",
    "webix/codebase/skins/aircompact"
);
include.libs(
    //"webix/codebase/webix_debug"
);
include.resources(
    "tango_consts", "tango_mixins", "tango_rest", "tango_helpers"
);
include.engines(
);
include.plugins(
    "controller", "view", "model", "model/cookie"
);

include("platform");

include(function () { //runs after prior includes are loaded
    include.models(
        "tango_webapp_storage", "data_base_device", "device", "dserver", "rest_api", "tango_host", "globals", "credentials", "device_filter"
    );
    include.controllers(
        "tango_webapp/main", "tango_webapp/login", "tango_webapp/device_tree"
    );
    include.views(
        "views/main_log_item",
        "views/start_page", "views/help",
        "views/device_info", "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    include.resources(
        "tango_ui"
    );
});
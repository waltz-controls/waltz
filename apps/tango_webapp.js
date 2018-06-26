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
);
include.engines(
);
include.plugins(
);

include(function () { //runs after prior includes are loaded
    include.models(
        "tango_webapp/device_filter", "tango_webapp/user_action", "tango_webapp/user_script"
    );
    include.controllers(
        "tango_webapp/main", "tango_webapp/user_action", "tango_webapp/top_toolbar", "tango_webapp/bottom_toolbar"
    );
    include.views(
        "views/dev_panel_error_out",
        "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    //webix widgets
    include.resources(
        "tango_webapp/setup"
    );
});
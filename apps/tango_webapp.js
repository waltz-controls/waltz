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
    
    //webix widgets
    include.resources(
        "webix_widgets/setup"
    );
});
include("platform");

include.application('Waltz', '0.7.5');

include.css(
    "tango_webapp"
    // "webix/codebase/skins/aircompact"
);

include(function () { //runs after prior includes are loaded
    include.models(
        "tango_webapp/device_filter", "tango_webapp/user_script"
    );
    include.controllers(
        "tango_webapp/main", "tango_webapp/bottom_toolbar"
    );
});

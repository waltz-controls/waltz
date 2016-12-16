include.application('TangoWebapp','0.2-SNAPSHOT');
include.css(
    "highlight",
    "webix/codebase/skins/air"
);
include.libs(
    //"webix/codebase/webix_debug"
);
include.resources(
    "tango_consts","tango_mixins", "tango_rest", "tango_helpers"
);
include.engines(
);
include.plugins(
    "controller","view","model"
    );

include(function(){ //runs after prior includes are loaded
  include.models(
      "data_base","device","dserver","rest_api"
    );
  include.controllers(
      "tango_webapp/main"
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
include.application('TangoWebapp','0.1-SNAPSHOT');
include.css(
    "webix/codebase/skins/aircompact"
);
include.libs(
    "webix/codebase/webix_debug"
);
include.resources(
    "tango_webapp/version",
    //
    "tango_consts","tango_mixins", "tango_rest", "tango_helpers"
);
include.engines(
);
include.plugins(
    "controller","view","model"
    );

include(function(){ //runs after prior includes are loaded
  include.models(
      "data_base","device"
    );
  include.controllers(
      "tango_webapp/main"
    );
  include.views(
      "views/start_page", "views/device_info", "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    include.resources(
        //
        "webix/device_tree", "webix/server_tree", "webix/toolbar",
        //dataviews
        "webix/device_info_view", "webix/device_properties_view", "webix/device_polling_view", "webix/device_event_view",
        "webix/device_attribute_config_view", "webix/device_logging_view", "webix/device_pipe_config_view", "webix/device_attribute_properties_view",
        //"webix/device_tab_view",
        //plot
        "webix/spectrum_plot","webix/image_plot",
        //atk
        "webix/atk_panel_view",
        //windows
        "webix/device_panel_window",
        "webix/device_view",
        "webix/main"
    );
});
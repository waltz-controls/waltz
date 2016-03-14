include.namespace('TangoWebapp');
include.css(
    
);
include.resources(
    
);
include.engines(
    'jsTangORB'
);
include.plugins(
    "controller","view","model"
    );

include(function(){ //runs after prior includes are loaded
  include.models(
      "DataBase"
    );
  include.controllers(
        "tango_webapp/main"
    );
  include.views(
      "views/device_info"
    );
});

include.resources(
    "webix/device_tree", "webix/server_tree", "webix/toolbar",
    //dataviews
    "webix/device_info_view", "webix/device_properties_view", "webix/device_polling_view", "webix/device_event_view",
    "webix/device_attribute_config_view", "webix/device_logging_view", "webix/device_pipe_config_view", "webix/device_attribute_properties_view"
);
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
    "webix/device_tree", "webix/server_tree", "webix/device_info_dataview"
);
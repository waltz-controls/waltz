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
        
    );
  include.controllers(
        "tango_webapp/main"
    );
  include.views(
        
    );
});
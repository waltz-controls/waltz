include('platform')

include.application('MyApp','0.1-SNAPSHOT');
include.css(
    
);
include.libs(
    
);

include.resources(
    
);
include.engines(
    
);
include.plugins(
    "controller","view","model"
    );

include(function(){ //runs after prior includes are loaded
  include.models(
        
    );
  include.controllers(
        "my_app/main"
    );
  include.views(
        
    );

    //webix widgets
    include.resources(
        "my_app/setup"
    );
});
include.application('Login','0.1-SNAPSHOT');
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
        "login/main"
    );
  include.views(
        
    );
});
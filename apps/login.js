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
    "controller"
    );

include(function(){ //runs after prior includes are loaded
  include.controllers(
        "login/main"
    );
});
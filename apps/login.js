include.application('Login','0.1-SNAPSHOT');

include.plugins(
    "controller"
    );

include(function(){ //runs after prior includes are loaded
  include.controllers(
        "login/main"
    );
});
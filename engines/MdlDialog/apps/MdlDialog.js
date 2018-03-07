include.resources('jquery.custom');
include.plugins(
'controller','controller/scaffold','controller/stateful',
'view','view/helpers',
'dom/element',
    'model'
);

include(function(){ //runs after prior includes are loaded
include.models('MdlDialog');
include.controllers('MdlDialog');
include.views('views/MdlDialog/init', 'views/MdlDialog/default_model');
});
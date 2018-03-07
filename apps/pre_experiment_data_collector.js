include("platform");

include.application('PreExperimentDataCollector', '0.1-SNAPSHOT');
include.css(

    );
include.libs(

    );

include.resources(

    );
include.engines(

    );
include.plugins(
    "controller", "view", "model"
    );

include(function () { //runs after prior includes are loaded
    include.models(

        );
    include.controllers(
        "pre_experiment_data_collector/main"
        );
    include.views(

        );
});
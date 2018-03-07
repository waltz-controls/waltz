include("platform");

include.application('PreExperimentDataCollector', '0.1-SNAPSHOT');

ApplicationContext = {
    domain:'http://localhost:8080/predator'
}

include.css(
    'pre_experiment_data_collector/all', 'pre_experiment_data_collector/validationEngine.jquery'
    );
include.libs(
    'jquery-1.7.1','jquery-ui-1.8.16.custom','jquery.noty-2.2.2.packaged','jquery.validationEngine-2.6.4', 'languages/jquery.validationEngine-en','webtoolkit.base64'
    );

include.resources(
    'pre_experiment_data_collector/string', 'pre_experiment_data_collector/wizard_step_view_helpers', 'pre_experiment_data_collector/init_helper',
    'pre_experiment_data_collector/noty_helper'
    );
include.engines(
    'Wizard', 'FileUpload', 'MdlDialog'
    );
include.plugins(
    'controller', 'controller/stateful',
    'view', 'view/helpers',
    'dom/element',
    'model/jsonp',
    'io/ajax'
    );

include(function () { //runs after prior includes are loaded
    include.models(
        'pre_experiment_data_collector/DataSet', 'pre_experiment_data_collector/WelcomeStep', 'pre_experiment_data_collector/WizardStep', 'pre_experiment_data_collector/FinalStep'
        );
    include.controllers(
        "pre_experiment_data_collector/main", 'pre_experiment_data_collector/Wizard', 'pre_experiment_data_collector/Welcome'
        );
    include.views(
        'views/pre_experiment_data_collector/WelcomeStep', 'views/pre_experiment_data_collector/FinalStep',
        'views/pre_experiment_data_collector/wizard.step.field',
        'views/pre_experiment_data_collector/wizard.step.fieldset', 'views/pre_experiment_data_collector/wizard.step.multichoice', 'views/pre_experiment_data_collector/wizard.step.upload',
        'views/pre_experiment_data_collector/final.value',
        'views/pre_experiment_data_collector/Welcome/create', 'views/pre_experiment_data_collector/Welcome/dataset_row', 'views/pre_experiment_data_collector/Welcome/upload'
        );
});
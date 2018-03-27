/**
 *
 * User: ingvord
 * Date: 3/8/14
 */
;/**
 * @param cbk a function to execute after initialization process finishes
 *
 * Specifically it loads WelcomeStep at first (loads available datasets) and then
 * loads WizardSteps (loads and parses meta)
 */
function InitHelper(cbk){
    var wizard = WizardController.newWizardEngine();

    function toggleLoading() {
        $('#loading-box').toggle();
        $('#example-2').toggle();
    }

    /**
     * JsonP failure callback
     *
     * @param instance
     */
    function onFailure(instance) {
        if(!instance.errors)
            noty.error("Unexpected error has occurred!");
        else
            $.each(instance.errors,function(ndx){
                noty.error(instance.errors[ndx]);
            });
    }

    /**
     * When everything is loaded this function initializes wizard, file upload, executes cbk
     * and toggles loading
     */
    function onLoaded() {
        WizardController.wizard.addForm(new FinalStep());

        try {
            WizardController.initialize();


            $('form.step[type="upload"]').each(function () {
                //                    new FileUpload(form.id,{data:form});
                var form = WizardStep.find_by_element($(this).get(0));
                Controller.publish("FileUpload.initialize", { data: form });
            });
        } catch (e) {
            noty.error(e.message);
        }

        //initialize validation engine for each form
        //we need to call it after wizard has been initialized
        $('.regular-form').validationEngine();

        //finally load data sets
        DataSet.find_all({},{
            onComplete:function(instances){
                console.log('DataSets are loaded.');
                cbk();

                toggleLoading();
            },
            onFailure:onFailure
        });
    }

    function loadWizardSteps() {
        WizardStep.find_all({}, {
            onComplete: function (instances) {
                for (var i = 0, size = instances.length; i < size; ++i) {
                    wizard.addForm(instances[i]);
                }
                onLoaded();
            },
            onFailure:onFailure
        });
    }

    var welcome = new WelcomeStep();
    wizard.addForm(welcome);
    loadWizardSteps();
}
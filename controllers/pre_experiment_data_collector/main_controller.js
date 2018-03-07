
/**
 * Controller
 *
 * @type {PreExperimentDataCollectorController}
 */
PreExperimentDataCollectorController = MVC.Controller.extend('main',
    /* @Static */
    {
        getUI:function(){
            return {
                template : "Body 1"
            }
        }
    },
    /* @Prototype */
    {

        /**
         *
         * @param {PlatformApi} platform_api
         */
        initialize: function (platform_api) {
            var ui_builder = platform_api.ui_builder;

            ui_builder.add_mainview_item({
                header:"PreExperiment Data Collector",
                body:this.Class.getUI()
            });
        }
    }
    );
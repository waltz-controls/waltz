
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
                template : "<div id='wrapper'>" +
                "<div id='loading-box'>" +
                "<div id='loading' title='Loading...'></div>" +
                "</div>" +
                "<div id='example-2' style='display: none;' class='wizard'>" +
                "<div class='header'>" +
                "</div>" +
                "<div id='Wizard'></div></div></div>"
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
        },
        "platform_api.ui.initialized subscribe": function(event){
            InitHelper(function(){
                noty.alert("Application has been initialized successfully.")
            });
        }
    }
    );
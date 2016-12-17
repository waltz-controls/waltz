/**
 * Main controller
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.MainController = MVC.Controller.extend('main', {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {Object} params
     */
    load: function (params) {
        TangoWebapp.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");
        TangoWebapp.globals = new TangoGlobals();

        TangoWebapp.databases = new webix.DataCollection();
        TangoWebapp.devices = new webix.DataCollection();

        TangoWebapp.helpers.createDatabase();

        webix.attachEvent("onBeforeAjax", function(mode, url, data, request, headers){
            request.withCredentials = true;
        });
        TangoWebapp.debug("main");
        //draw ui
        webix.ui({
            view: "Main",
            id  : "main"
        });

        webix.ui({
            container: "getting-started-carousel",
            view:"carousel",
            id:"carousel",
            width:464,
            height:275,
            cols:[
                { template:"<img src='images/ctx.png'/>" },
                { template:"<img src='images/sort.png'/>" },
                { template:"<img src='images/edt.png'/>" },
                { template:"<img src='images/log.png'/>" }
            ]
        });
    }
});
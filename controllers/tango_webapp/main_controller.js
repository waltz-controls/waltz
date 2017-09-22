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

        var storedGlobals = TangoGlobals.find_all();
        //if we have stored globals use them, otherwise create new ones
        if(storedGlobals[0])
            TangoWebapp.globals = storedGlobals[0];
        else {
            var globals = new TangoGlobals();

            //update cookie
            TangoGlobals.update(globals.id, globals.attributes());

            TangoWebapp.globals = globals;
        }

        TangoWebapp.devices = new webix.DataCollection();

        TangoWebapp.globals.rest_api_host.addDb(TangoWebapp.globals.tango_host);


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

        webix.ui({
            view: "login",
            id: "login"
        }).show();
    },
    "tango_webapp.rest_failure subscribe": function (data) {
        debugger
        //TODO update loading status
    },
    "tango_webapp.rest_success subscribe": function (data) {
        debugger
        //TODO update loading status
    }
});
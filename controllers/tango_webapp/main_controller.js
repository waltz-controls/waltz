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
    }
});
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
        webix.ui({
            view: "login",
            id: "login"
        }).show();
    },
    "tango_webapp.user_context_loaded subscribe": function (data) {
        debugger
        //TODO create REST load hosts etc


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
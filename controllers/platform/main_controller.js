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
    "tango_webapp.user_login subscribe": function (data) {
        debugger;
        var user_name = data.name;
        var context = TangoWebapp.UserContext.find_one(user_name);

        //TODO move to toolbar controller
        $$("main-toolbar").$$("lblUsername").setValue(context.user);

        context.rest.isAlive()
            .then(function () {
                context.tango_hosts.forEach(function (it) {
                    context.rest.fetchHost.apply(context.rest, it.split(':'));
                })
            })
            .fail(function () {
                //TODO error window
            })

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
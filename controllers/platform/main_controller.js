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
        if (storedGlobals[0])
            TangoWebapp.globals = storedGlobals[0];
        else {
            var globals = new TangoGlobals();

            //update cookie
            TangoGlobals.update(globals.id, globals.attributes());

            TangoWebapp.globals = globals;
        }

        webix.ui(TangoWebapp.LoginController.getUI()).show();

        //draw ui
        webix.ui({
            view: 'layout',
            id: 'main',
            type: 'space',
            rows: [
                TangoWebapp.ui.newMainToolbar(),
                {
                    id: "content"
                },
                TangoWebapp.BottomToolbar.getUI()
            ]
        });
        TangoWebapp.debug("platform/main");
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

    }
});
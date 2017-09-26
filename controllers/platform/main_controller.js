/**
 * Main controller
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.platform.MainController = MVC.Controller.extend('main', {
}, {
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

        webix.ui(TangoWebapp.platform.LoginController.getUI()).show();

        //draw ui
        webix.ui({
            view: 'layout',
            id: 'main',
            type: 'space',
            rows: [
                TangoWebapp.platform.TopToolbarController.getUI(),
                {
                    id: "content"
                },
                TangoWebapp.platform.BottomToolbar.getUI()
            ]
        });
        webix.ui.fullScreen();

        TangoWebapp.debug("platform/main");
    },
    "tango_webapp.user_login subscribe": function (data) {
        var user_context = TangoWebapp.platform.UserContext.find_one(data.name);

        var rest = new TangoWebapp.TangoRestApi({url: user_context.rest_url});

        TangoWebapp.platform.PlatformContext.create({
            user_context: user_context,
            rest: rest
        });
    },
    "tango_webapp.user_logout subscribe": function (event) {
        PlatformContext.destroy();
    },
    "platform_context.set_rest subscribe": function (event) {
        var context = event.data;
        var rest = event.data.rest;

        rest.isAlive()
            .fail(function () {
                alert("TANGO REST API host is not alive!!! Please change it in the top toolbar!")
            })
    },
    "tango_webapp.device_loaded subscribe": function (event) {
        PlatformContext.devices.add(event.data);
    },
    "tango_webapp.tango_host_loaded subscribe": function (event) {
        PlatformContext.tango_hosts.add(event.data);
    }
});
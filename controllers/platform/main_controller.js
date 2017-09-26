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
        webix.html.remove(document.getElementById('ajax-loader'));

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
        debugger
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
            .then(function (rest) {
                var tangoHosts = context.user_context.tango_hosts;
                for (var it in tangoHosts) {
                    if (!tangoHosts.hasOwnProperty(it)) continue;
                    rest.fetchHost.apply(rest, it.split(':'))
                        .then(function (host) {
                            PlatformContext.add_tango_host(host);
                        });
                }
            })
            .fail(function () {
                alert("TANGO REST API host is not alive!!! Please change it in the top toolbar!")
            })
    }
});
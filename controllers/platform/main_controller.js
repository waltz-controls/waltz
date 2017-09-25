/**
 * Main controller
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.platform.MainController = MVC.Controller.extend('main', {

    /**
     *
     * @param newRestApiUrl
     *
     * @inner
     */
    changeTangoRestApiUrl: function (newRestApiUrl) {
        var tangoRestApi = new TangoWebapp.TangoRestApi({url: newRestApiUrl});
        PlatformContext.current.set_rest(tangoRestApi);
    }
}, {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {Object} params
     */
    load: function (params) {
        new PlatformContext();

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
        var context = data.data;

        var rest = new TangoWebapp.TangoRestApi({url: context.rest_url});

        PlatformContext.current.set_rest(rest);
    },
    "tango_webapp.platform_context.set_rest subscribe": function (event) {
        var rest = event.data.rest;

        rest.isAlive()
            .then(function (rest) {
                UserContext.current.tango_hosts.forEach(function (it) {
                    rest.fetchHost.apply(rest, it.split(':'))
                        .then(function (host) {
                            PlatformContext.current.add_tango_host(host);
                        });
                })
            })
            .fail(function () {
                alert("TANGO REST API host is not alive!!! Please change it in the top toolbar!")
            })
    }
});
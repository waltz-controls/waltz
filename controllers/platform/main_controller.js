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
        TangoWebapp.platform.PlatformContext.current.set_rest(tangoRestApi);
        TangoWebapp.platform.UserContext.current.update_attributes({
            rest_url: newRestApiUrl
        });
    }
}, {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {Object} params
     */
    load: function (params) {
        new TangoWebapp.platform.PlatformContext();

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

        rest.isAlive()
            .then(function () {
                context.tango_hosts.forEach(function (it) {
                    // context.rest.fetchHost.apply(context.rest, it.split(':'));
                })
            })
            .fail(function () {
                //TODO error window
            })

    }
});
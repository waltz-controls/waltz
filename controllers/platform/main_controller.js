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
        //popup login screen
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

        TangoWebappHelpers.debug("platform/main done.");
    },
    "tango_webapp.user_login subscribe": function (data) {
        var user_context = TangoWebapp.platform.UserContext.find_one(data.name);
        TangoWebappHelpers.debug(user_context.toString());

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
        var rest = event.data.rest;

        rest.isAlive()
            .then(function (rest) {
                TangoWebappHelpers.log("Tango REST API host has been set to " + rest.url);
            })
            .fail(function (rest) {
                TangoWebappHelpers.error("Tango REST API host has been set to " + rest.url);
                webix.alert({
                    title: "<span class='webix_icon fa-warning' style='color: red;'></span>",
                    text: "<p class='webix_strong'>Failed to ping Tango REST API host!!!</p><p>Try to change it in the top toolbar!</p><p>Or double check username and password (logout and login)!</p><div style='height: 100px;'/>",
                    type: 'alert-error',
                    width: 480,
                    height: 320
                });

            })
    },
    /**
     * Refreshes device in the context
     *
     * @param event
     */
    "tango_webapp.device_loaded subscribe": function (event) {
        if (PlatformContext.devices.exists(event.data.id)) {
            PlatformContext.devices.updateItem(event.data.id, event.data);
        } else {
            PlatformContext.devices.add(event.data);
        }
    },
    "tango_webapp.tango_host_loaded subscribe": function (event) {
        if (PlatformContext.tango_hosts.exists(event.data.id)) {
            PlatformContext.tango_hosts.updateItem(event.data.id, event.data);
        } else {
            PlatformContext.tango_hosts.add(event.data);
        }
    },
    "user_context.delete_tango_host subscribe": function (event) {
        PlatformContext.tango_hosts.remove(event.data);
    }
});
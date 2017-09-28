/**
 * Main controller of the TangoWebapp applcation. It is responsible for creating main application UI after platform context has been initialized
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.MainController = MVC.Controller.extend('main', {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {Object} event - event.data contains fully properly initialized PlatformContext model
     * @see PlatformContext
     */
    "platform_context.create subscribe": function (event) {
        if ($$('tango-webapp') === undefined) {
            webix.ui({
                id: 'tango-webapp',
                multi: true,
                cols: [
                    {
                        header: "<span class='webix_icon fa-sitemap'></span> Devices Tree",
                        body: {
                            context: event.data,
                            view: 'devices_tree'
                        }
                    },
                    {
                        borderless: true,
                        context: event.data,
                        body: {
                            type: 'space',
                            view: "tabview",
                            id: "main-tabview",
                            cells: [
                                {
                                    header: "<span class='webix_icon fa-dashboard'></span> Dashboard",
                                    body: {
                                        id: 'dashboard',
                                        view: "dashboard"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        header: "<span class='webix_icon fa-microchip'></span> Device Test Panel",
                        collapsed: true,
                        body: {
                            context: event.data,
                            view: 'test_device_panel'
                        }
                    }
                ]
            }, $$('content'));

            webix.html.remove(document.getElementById('ajax-loader'));
        }

        webix.ui.fullScreen();
    }
});
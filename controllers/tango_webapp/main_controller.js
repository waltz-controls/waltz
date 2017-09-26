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
    "platform_context.init subscribe": function (event) {
        TangoWebapp.devices = new webix.DataCollection();

        TangoWebapp.globals.rest_api_host.addDb(TangoWebapp.globals.tango_host);

        if ($$('tango-webapp') === undefined) {
            webix.ui({
                id: 'tango-webapp',
                multi: true,
                cols: [
                    {
                        header: "<span class='webix_icon fa-sitemap'></span> Devices Tree",
                        body: TangoWebapp.ui.newDeviceTree()
                    },
                    {
                        borderless: true,
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
                    }
                ]
            }, $$('content'));

            webix.html.remove(document.getElementById('ajax-loader'));
        }

        webix.ui.fullScreen();
    }
});
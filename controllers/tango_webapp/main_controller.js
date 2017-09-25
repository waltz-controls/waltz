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


        TangoWebapp.devices = new webix.DataCollection();

        TangoWebapp.globals.rest_api_host.addDb(TangoWebapp.globals.tango_host);


        webix.ui({
            multi: true,
            cols: [
                {
                    header: "Devices Tree",
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
                                header: "<span class='webix_icon fa-dashboard'></span> My Dashboard",
                                body: {
                                    view: "dashboard"
                                }
                            }
                        ]
                    }
                }
            ]
        }, $$('content'));

        webix.ui.fullScreen();
    }
});
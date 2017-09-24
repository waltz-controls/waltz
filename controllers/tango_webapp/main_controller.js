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
            cols: [
                TangoWebapp.ui.newDeviceTree(),
                {view: "resizer"},
                {type: "space", width: 10},
                {view: "resizer"},
                {
                    view: "tabview",
                    id: "main-tabview",
                    cells: [
                        {
                            header: "Start page",
                            body: {
                                view: "layout",
                                padding: 10,
                                // css: {"background-color": "rgb(255, 255, 255)"},
                                rows: [
                                    {
                                        //css: {"text-align" : "center", "background-image": "linear-gradient(rgb(229, 241, 255), rgb(255, 255, 255))"},
                                        template: new View({url: 'views/start_page.ejs'}).render()
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }, $$('content'));

        webix.ui({
            container: "getting-started-carousel",
            view: "carousel",
            id: "carousel",
            width: 464,
            height: 275,
            cols: [
                {template: "<img src='images/ctx.png'/>"},
                {template: "<img src='images/sort.png'/>"},
                {template: "<img src='images/edt.png'/>"},
                {template: "<img src='images/log.png'/>"}
            ]
        });
    }
});
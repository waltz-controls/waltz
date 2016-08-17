webix.protoUI({
    name: "Main",
    defaults: {
        rows: [
            TangoWebapp.ui.newMainToolbar(),
            {
                cols: [
                    {
                        view: "tabview",
                        width: 250,
                        cells: [
                            {
                                header: "Devices",
                                body: TangoWebapp.ui.newDeviceTree()
                            },
                            {
                                header: "Servers",
                                body: {
                                    template: "Not yet implemented!"
                                }
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        view: "tabview",
                        id: "main-tabview",
                        cells: [
                            {
                                header: "Start page",
                                body: {
                                    view: "layout",
                                    padding: 100,
                                    css: {"background-image": "linear-gradient(rgb(255, 255, 255), rgb(229, 241, 255))"},
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
            }
        ]
    }
}, webix.ui.layout);
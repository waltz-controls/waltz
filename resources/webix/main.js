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
                                body: TangoWebapp.ServerTreeConfig
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
                                    template: new View({url: 'views/start_page.ejs'}).render()
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}, webix.ui.layout);
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
                                    padding: 50,
                                    css: {"background-image": "linear-gradient(rgb(255, 255, 255), rgb(229, 241, 255))"},
                                    rows: [
                                        {
                                            css: {"text-align" : "center", "background-image": "linear-gradient(rgb(229, 241, 255), rgb(255, 255, 255))"},
                                            template: '<img src="images/logo.png" style="display: inline-block;vertical-align: middle;" ondragstart="return false"/>'
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
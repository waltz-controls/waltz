webix.protoUI({
    name    : "Main",
    defaults: {
        rows: [
            TangoWebapp.ToolbarConfig,
            {
                cols: [
                    {
                        view : "tabview",
                        width: 250,
                        cells: [
                            {
                                header: "Device",
                                body  : TangoWebapp.DeviceTreeConfig
                            },
                            {
                                header: "Server",
                                body  : TangoWebapp.ServerTreeConfig
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        view : "tabview",
                        id   : "main-tabview",
                        cells: [
                            {
                                header: "Start page",
                                body  : {
                                    template: "Hello"
                                }
                            }
                        ]
                    }


                ]
            }
        ]
    }
}, webix.ui.layout);
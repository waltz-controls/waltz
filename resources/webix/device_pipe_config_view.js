webix.protoUI({
    name: "Device Pipe Config",
    defaults: {
        rows: [
            {
                view: "tabview",
                cells: [
                    {
                        header: "Label",
                        body: {
                            id: "label",
                            view: "datatable",
                            columns: [
                                {header: "Pipe name"},
                                {header: "Label"}
                            ]

                        }
                    },
                    {
                        header: "Description",
                        body: {
                            id: "description",
                            view: "datatable",
                            columns: [
                                {header: "Pipe name"},
                                {header: "Description"}
                            ]

                        }
                    },
                    {
                        header: "Settings",
                        body: {
                            id: "settings",
                            view: "datatable",
                            columns: [
                                {header: "Parameters name"},
                                {header: "Value"}
                            ]

                        }
                    }
                ]
            },

            {
                view: "toolbar",
                cols: [
                    {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left"},
                    {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"}]
            }

        ]
    }
}, webix.IdSpace, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.DevicePipeConfViewConfig = {
    view: "Device Pipe Config",
    id: "device_pipe_config"
};
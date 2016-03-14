webix.protoUI({
    name: "DevicePipeConfig",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Logging [#name#]"
            },
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
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DevicePipeConfViewConfig = {
    view: "DevicePipeConfig",
    id: "Pipe config"
};
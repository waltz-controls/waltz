webix.protoUI({
    name: "DevicePolling",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Device Polling [#name#]"
            },
            {
                view: "tabview",
                cells: [
                    {
                        header: "Commands",
                        body: {
                            id: "commands",
                            view: "datatable",
                            columns: [
                                {header: "Command name"},
                                {header: "Is Polled"},
                                {header: "Period (ms)"}
                            ]

                        }
                    },
                    {
                        header: "Attributes",
                        body: {
                            id: "attributes",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Is Polled"},
                                {header: "Period (ms)"}
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
                    {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"},
                    {view: "button", id: "btnReset", value: "Reset", width: 100, align: "left"}]
            }

        ]
    }
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DevicePollingViewConfig = {
    view: "DevicePolling",
    id: "Polling"
};
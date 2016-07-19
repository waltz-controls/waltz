webix.protoUI({
    name: "Device Polling"
}, webix.IdSpace, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.newDevicePolling = function () {
    return {
        view: "Device Polling",
        id  : "device_polling",
        rows: [
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
};
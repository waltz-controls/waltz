webix.protoUI({
    name: "Device Event"
}, webix.IdSpace, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.newDeviceEvents = function () {
    return {
        view: "Device Event",
        id  : "device_events",
        rows: [
            {
                view: "tabview",
                cells: [
                    {
                        header: "Change event",
                        body: {
                            id: "change",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Absolute"},
                                {header: "Relative"}
                            ]

                        }
                    },
                    {
                        header: "Archive event",
                        body: {
                            id: "archive",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Absolute"},
                                {header: "Relative"},
                                {header: "Period (ms)"}
                            ]

                        }
                    },
                    {
                        header: "Periodic event",
                        body: {
                            id: "periodic",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Period (ms)"}
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
};
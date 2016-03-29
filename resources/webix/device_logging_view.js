webix.protoUI({
    name: "Device Logging",
    defaults: {
        rows: [
            {
                id: "display",
                view: "datatable",
                columns: [
                    {header: "Property name"},
                    {header: "Value"}
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

TangoWebapp.DeviceLoggingViewConfig = {
    view: "Device Logging",
    id: "device_logging"
};
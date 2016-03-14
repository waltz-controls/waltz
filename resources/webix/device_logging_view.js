webix.protoUI({
    name: "DeviceLogging",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Logging [#name#]"
            },
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
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DeviceLoggingViewConfig = {
    view: "DeviceLogging",
    id: "Logging"
};
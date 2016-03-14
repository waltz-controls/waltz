webix.protoUI({
    name: "DeviceProperties",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Device properties [#name#]"
            },
            {
                view: "datatable",
                id:"device_properties_data",
                columns: [
                    {header: "Property name"},
                    {header: "Value"}
                ]
            },
            {
                view: "toolbar",
                id: "devPropertiesToolbar",
                cols: [
                    {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left"},
                    {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"},
                    {view: "button", id: "btnNewProperty", value: "New Property", width: 100, align: "left"},
                    {view: "button", id: "btnCopy", value: "Copy", width: 100, align: "left"},
                    {view: "button", id: "btnDelete", value: "Delete", width: 100, align: "left"}]
            }
        ]
    }
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DevicePropertiesViewConfig = {
    view: "DeviceProperties",
    id: "Properties"
};
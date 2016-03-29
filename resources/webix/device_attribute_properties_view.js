webix.protoUI({
    name: "Device Attr Props",
    defaults: {
        rows: [
            {
                view: "tabview",
                cells: [
                    //TODO dynamically add tabs when loaded?
                    {
                        header: "Prop1",
                        body: {
                            id: "name",
                            view: "datatable",
                            columns: [
                                {header: "Property name"},
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

TangoWebapp.DeviceAttrPropsViewConfig = {
    view: "Device Attr Props",
    id: "device_attr_properties"
};
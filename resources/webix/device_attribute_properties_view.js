webix.protoUI({
    name: "DeviceAttrProps",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Device attributes' properties [#name#]"
            },
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
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DeviceAttrPropsViewConfig = {
    view: "DeviceAttrProps",
    id: "Attribute properties"
};
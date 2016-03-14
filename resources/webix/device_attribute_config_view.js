webix.protoUI({
    name: "DeviceAttrConfig",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Attributes configuration [#name#]"
            },
            {
                view: "tabview",
                cells: [
                    {
                        header: "Display",
                        body: {
                            id: "display",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Label"},
                                {header: "Format"}
                            ]

                        }
                    },
                    {
                        header: "Unit",
                        body: {
                            id: "unit",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Unit"},
                                {header: "Display unit"},
                                {header: "Standard unit"}
                            ]

                        }
                    },
                    {
                        header: "Range",
                        body: {
                            id: "range",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Min value"},
                                {header: "Max value"}
                            ]

                        }
                    },
                    {
                        header: "Alarms",
                        body: {
                            id: "alarms",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Min alarm"},
                                {header: "Max alarm"},
                                {header: "Min warning"},
                                {header: "Max warning"},
                                {header: "Delta t"},
                                {header: "Delta val"}

                            ]

                        }
                    },
                    {
                        header: "Description",
                        body: {
                            id: "description",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Description"}
                            ]
                        }
                    } ,
                    {
                        header: "Alias",
                        body: {
                            id: "alias",
                            view: "datatable",
                            columns: [
                                {header: "Attribute name"},
                                {header: "Description"}
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

TangoWebapp.DeviceAttrConfigViewConfig = {
    view: "DeviceAttrConfig",
    id: "Attribute config"
};
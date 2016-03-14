webix.protoUI({
    name: "DeviceEvent",
    defaults: {
        rows: [
            {
                view: "template",
                type: "header",
                template: "Event [#name#]"
            },
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
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DeviceEventViewConfig = {
    view: "DeviceEvent",
    id: "Event"
};
webix.protoUI({
    name: "Main",
    defaults: {
        type: "space",
        rows: [
            TangoWebapp.ui.newMainToolbar(),
            {
                id: "content"
            },
            TangoWebapp.BottomToolbar.getUI()
        ]
    }
}, webix.ui.layout);
MVC.Object.extend(TangoWebapp.ui, {
    _webix_files: [
        "dashboard",
        "devices_tree",
        "test_device_panel",
        "device_view", "device_properties_view", "device_polling_view"
    ]
});

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../apps/tango_webapp/webix')); //this file is created during compression
} else
    include.apply(include, TangoWebapp.ui._webix_files);
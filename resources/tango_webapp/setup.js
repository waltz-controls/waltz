TangoWebapp.ui = {
    _webix_files: [
        "logger_view",//TODO move to platform
        "dashboard",
        "devices_tree",
        "spectrum_plot", "image_plot", "scalar_plot", "test_device_panel",
        "device_view", "device_properties_view", "device_polling_view", "device_events_view",
        "device_attributes_config_view", "device_logging_view",
        "device_monitor_view"
    ]
};

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../../apps/tango_webapp/webix')); //this file is created during compression
} else
    include.apply(include, TangoWebapp.ui._webix_files);
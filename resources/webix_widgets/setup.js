TangoWebappPlatform.ui = {
    _webix_files: [
        "critical_error_no_rest", "logger", "toolbar",
        "settings","user_log","info_datatable",
        "devices_tree", "device_view_panel",
        "plot",
        "tango_host_view",
        "device_view", "device_properties_view", "device_polling_view", "device_events_view",
        "device_attributes_config_view", "device_logging_view",
        "attrs_monitor_view","device_monitor_view","scripting_console"
    ]
};

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../../apps/'+MVC.app_name+'/webix')); //this file is created during compression
} else
    include.apply(include, TangoWebappPlatform.ui._webix_files);
TangoWebapp.ui = {
    _webix_files0: [
        //
        "webix/logger_view", "webix/device_tree", "webix/server_tree", "webix/toolbar",
        //dataviews
        "webix/device_info_view", "webix/device_properties_view", "webix/device_polling_view", "webix/device_event_view",
        "webix/device_attribute_config_view", "webix/device_logging_view", "webix/device_pipe_config_view", "webix/device_attribute_properties_view",
        //"webix/device_tab_view",
        //plot
        "webix/spectrum_plot","webix/image_plot",
        //atk
        "webix/atk_panel_view",
        //windows
        "webix/device_panel_window",
        "webix/device_view"
    ]
};

if(MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else
    if(MVC.env() === 'production') {
        include.add( include.add_defaults('../apps/tango_webapp/webix')); //this file is created during compression
    }else
        include.apply(include, TangoWebapp.ui._webix_files0);
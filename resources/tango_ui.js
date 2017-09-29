TangoWebapp.ui = {
    _webix_files0: [
        //
        "webix/logger_view", "webix/toolbar",
        //"webix/device_tab_view",
        //plot
        "webix/spectrum_plot","webix/image_plot",
        //atk
        "webix/atk_panel_view"
    ]
};

if(MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else
    if(MVC.env() === 'production') {
        include.add(include.add_defaults('../apps/tango_webapp/webix0')); //this file is created during compression
    }else
        include.apply(include, TangoWebapp.ui._webix_files0);
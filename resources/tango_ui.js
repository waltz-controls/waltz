TangoWebapp.ui = {
    _webix_files0: [
        //
        "webix/toolbar"
        //"webix/device_tab_view",
    ]
};

if(MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else
    if(MVC.env() === 'production') {
        include.add(include.add_defaults('../apps/tango_webapp/webix0')); //this file is created during compression
    }else
        include.apply(include, TangoWebapp.ui._webix_files0);
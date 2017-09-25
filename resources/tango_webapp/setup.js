MVC.Object.extend(TangoWebapp.ui, {
    _webix_files: [
        "dashboard"
    ]
});

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../apps/tango_webapp/webix')); //this file is created during compression
} else
    include.apply(include, TangoWebapp.ui._webix_files);
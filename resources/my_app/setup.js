MyApp.ui = {
    _webix_files: [
        "../tango_webapp/critical_error_no_rest",
        "../tango_webapp/plot",
        "my_dashboard"
    ]
};

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../../apps/my_app/webix')); //this file is created during compression
} else
    include.apply(include, MyApp.ui._webix_files);
TangoWebapp.LoginController = MVC.Controller.extend("login_controller", {
    "credentials.create.as_existing subscribe": function (data) {
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            headers["Authorization"] = "Basic " + btoa(data.data.toString());
        });
        $$("main-toolbar").$$("lblUsername").setValue(data.data.name);
        TangoWebapp.debug("Attached Authorization header for " + data.data);
    },
    "credentials.destroy subscribe": function () {
        $$("login").show();
    }
});
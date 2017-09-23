TangoWebapp.LoginController = MVC.Controller.extend("login_controller", {
}, {
    "tango_webapp.user_login subscribe": function (data) {
        var user_name = data.name;
        var user_password = data.password;
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            x.withCredentials = true;
            headers["Authorization"] = "Basic " + btoa(user_name + ":" + user_password);
            TangoWebapp.debug("Attached Authorization header for " + user_name);
        });

        var userContext = TangoWebapp.UserContext.find_one(user_name);

        $$("main-toolbar").$$("lblUsername").setValue(userContext.user);

        $$("login").hide();
    },
    "tango_webapp.user_logout subscribe": function () {
        TangoWebapp.UserContext.instance.destroy();

        $$("login").show();
    }
});
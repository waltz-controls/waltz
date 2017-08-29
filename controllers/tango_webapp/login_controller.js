TangoWebapp.LoginController = MVC.Controller.extend("login_controller", {
    init: function () {
        this._super();
        webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
            request.withCredentials = true;
        });
        webix.attachEvent("onAjaxError", function (xhr) {
            if (xhr.status === 401)
                TangoWebapp.error("Unauthorised!");
            else if (xhr.status === 0)
                TangoWebapp.error("Unspecified error!");
            else
                debugger;
        });
    }
}, {

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
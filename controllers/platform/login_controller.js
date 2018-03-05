TangoWebapp.platform.LoginController = MVC.Controller.extend("login_controller", {
    "platform.user_logout subscribe": function () {
        PlatformContext.destroy();
        window.location = "../../apps/login/index.jsp"
    }
});
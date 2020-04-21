TangoWebappPlatform.LoginController = class extends MVC.Controller{
    static get className(){
        return "login_controller";
    }
    "platform.user_logout subscribe"() {
        PlatformContext.destroy();
        window.location = "../../apps/login/index.jsp"
    }
};

TangoWebappPlatform.LoginController.initialize();
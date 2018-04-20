TangoWebappPlatform.UIController = MVC.Controller.extend("platform_ui_controller", {}, {
    /**
     *
     * @param user
     * @event {OpenAjax} user_context_controller.found
     */
    expandDeviceTree:function(){
        $$('device_tree').expand();
    }
});
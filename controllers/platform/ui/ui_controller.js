TangoWebappPlatform.UIController = class extends MVC.Controller {
    static get className(){
        return "platform_ui_controller";
    }
    static get _attach_actions(){
        return false;
    }
    /**
     *
     * @param user
     * @event {OpenAjax} user_context_controller.found
     */
    expandDeviceTree() {
        $$('device_tree').expand();
    }
    /**
     *
     * @param {TangoHost} tango_host
     * @param {webix.ui.tab} device_tab
     */
    openTangoHostTab(tango_host, device_tab) {
        if ($$('view/' + tango_host.id) === undefined)
            $$("main-tabview").addView(
                TangoWebapp.ui.newTangoHostTab(tango_host, device_tab)
            );
        else {
            if(!$$(device_tab.body.id))
                $$('view/' + tango_host.id).addView(device_tab);

        }
        $$('view/' + tango_host.id).show();

        return $$('view/' + tango_host.id);
    }
    /**
     *
     * @param {TangoDevice} device
     */
    openDeviceViewTab(device) {
        var device_view_id = "view/" + device.id;
        this.openTangoHostTab(device.host, TangoWebapp.ui.newDeviceView(
            {
                device: device,
                id: device_view_id
            }));

        return $$(device_view_id);
    }
    /**
     * Opens settings tab
     *
     */
    openSettingsTab() {
        if($$('settings') === undefined){
            $$("main-tabview").addView(
                TangoWebapp.ui.newSettingsTab()
            );
        }
        $$('settings').show();

        return $$('settings');
    }
    /**
     * Opens scripting tab
     *
     */
    openScriptingTab() {
        if($$('scripting_console') === undefined){
            $$("main-tabview").addView(
                TangoWebapp.ui.newStatefulScriptingConsoleTab()
                );
        }
        $$('scripting_console').show();

        return $$('scripting_console');
    }
    /**
     *
     * @param {TangoHost} tango_host
     */
    closeTangoHostTab(tango_host) {

        $$("main-tabview").removeView(
            'view/' + tango_host.id
        );
    }
    /**
     *
     * @param {TangoDevice} device
     */
    openDeviceMonitorTab(device) {
        var device_view_id = "monitor/" + device.id;

        this.openTangoHostTab(device.host, TangoWebapp.ui.newDeviceMonitorView({
            device: device,
            id: device_view_id
        }));

        return $$(device_view_id);

    }
};

TangoWebappPlatform.UIController.initialize();
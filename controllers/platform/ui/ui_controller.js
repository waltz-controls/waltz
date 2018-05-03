TangoWebappPlatform.UIController = MVC.Controller.extend("platform_ui_controller", {}, {
    /**
     *
     * @param user
     * @event {OpenAjax} user_context_controller.found
     */
    expandDeviceTree: function () {
        $$('device_tree').expand();
    },
    /**
     *
     * @param {TangoHost} tango_host
     * @param {webix.ui.tab} device_tab
     */
    openTangoHostTab: function (tango_host, device_tab) {
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
    },
    /**
     *
     * @param {TangoDevice} device
     */
    openDeviceViewTab: function (device) {
        var device_view_id = "view/" + device.id;
        this.openTangoHostTab(device.host, TangoWebapp.ui.newDeviceView(
            {
                device: device,
                id: device_view_id
            }));

        return $$(device_view_id);
    },
    /**
     *
     * @param {TangoHost} tango_host
     */
    closeTangoHostTab: function (tango_host) {

        $$("main-tabview").removeView(
            'view/' + tango_host.id
        );
    },
    /**
     *
     * @param {TangoDevice} device
     */
    openDeviceMonitorTab: function (device) {
        var device_view_id = "monitor/" + device.id;

        this.openTangoHostTab(device.host, TangoWebapp.ui.newDeviceMonitorView({
            device: device,
            id: device_view_id
        }));

        return $$(device_view_id);

    }
});
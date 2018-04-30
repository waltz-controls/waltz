/**
 * Main controller of the TangoWebapp applcation. It is responsible for creating main application UI after platform context has been initialized
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.MainController = MVC.Controller.extend('main', {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {PlatformApi} platform_api - event.data contains fully properly initialized PlatformContext model
     * @see PlatformContext
     */
    buildUI: function (platform_api) {
        var ui_builder = platform_api.ui_builder;

        ui_builder.add_left_sidebar_item({
            header: "<span class='webix_icon fa-sitemap'></span> Devices",
            body: {
                context: platform_api.context,
                view: 'devices_tree'
            }
        });

        ui_builder.add_left_sidebar_item(TangoWebapp.ui.newDeviceTree(platform_api.context));

        ui_builder.set_right_item(TangoWebapp.ui.newDeviceControlPanel(platform_api.context));

        ui_builder.add_mainview_item(
            {
                header: "<span class='webix_icon fa-dashboard'></span> Dashboard",
                borderless: true,
                body: TangoWebapp.ui.newStatefulAttrsMonitorView({id: 'configurable_monitor'})
            });

        ui_builder.add_mainview_item(
            {
                header: "<span class='webix_icon fa-wrench'></span> Tools",
                borderless: true,
                body: TangoWebapp.ui.newToolsView({id: 'scripting_console'})
            });

        ui_builder.add_mainview_item(
            {
                header: "<span class='webix_icon fa-gears'></span> Settings",
                body: {
                    id: 'settings',
                    view: "settings"
                }
            });
    },
    initialize:function(platform_api){
        OpenAjax.hub.publish("platform_api.ui.initialized", {data: platform_api});
    },
    _promise_device: function (data) {
        var promise;
        var id = data.id;
        if (PlatformContext.devices.exists(id))
            promise = webix.promise.resolve(PlatformContext.devices.getItem(id));
        else
            promise = PlatformContext.tango_hosts.getItem(data.host_id).fetchDevice(data.name);
        return promise.then(function (device) {
            PlatformContext.devices.setCursor(device.id);
            return device;
        });
    },
    //TODO move to ui_controller
    "tango_webapp.device_configure subscribe": function (event) {
        var promise = this._promise_device(event.data);

        promise.then(function (device) {
            if (!device.info.exported) throw "Device[" + device.id + "] is not exported";

            var deviceTab =
                PlatformApi.PlatformUIController().openDeviceViewTab(device);

            deviceTab.show();

            deviceTab.$$(event.data.tab).activate();
        }).fail(TangoWebappHelpers.error);
    },
    "tango_webapp.device_view subscribe": function (event) {
        var promise = this._promise_device(event.data);

        promise.then(function (device) {
            if (!device.info.exported) throw "Device[" + device.id + "] is not exported";

            var deviceTab =
                PlatformApi.PlatformUIController().openDeviceMonitorTab(device);

            deviceTab.show();

            deviceTab.activate();
        }).fail(TangoWebappHelpers.error);
    },
    "tango_webapp.device_delete subscribe": function (event) {
        var promise = this._promise_device(event.data);

        promise.then(function (device) {
            return device.host.fetchDatabase();
        }).then(function (db) {
            return db.deleteDevice(event.data.name);
        }).then(function () {
            $$('devices-tree').updateRoot();
        }).fail(TangoWebappHelpers.error);
    },
    "tango_webapp.attr_add_to_monitor subscribe": function(event){
        var attr = event.data;
        var $$monitor = $$('configurable_monitor');
        $$monitor.addAttribute(attr);
        if(!$$monitor.isRunning()) $$monitor.start();
    }
});

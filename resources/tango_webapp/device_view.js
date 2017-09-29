webix.protoUI({
    _device : null,
    name: "device_view",
    $init   : function (config) {
        this._device = config.device;

        //set header Device [...]
    },
    defaults: {
        animate: false
    }
}, webix.IdSpace, webix.ui.tabview);

TangoWebapp.ui.newDeviceView = function (config) {
    return {
        header: "Device [" + config.device.name + "]",
        close : true,
        body  : {
            view: "device_view",
            id   : config.id,
            cells: [
                {
                    header: "Properties",
                    body: TangoWebapp.ui.newDevicePropertiesView(config.device)
                },
                {
                    header: "Polling",
                    body: TangoWebapp.ui.newDevicePollingView(config.device)
                },
                {
                    header: "Events",
                    body  : TangoWebapp.ui.newDeviceEvents(config.device)
                },
                {
                    header: "Attributes config",
                    body  : TangoWebapp.ui.newDeviceAttrConfig(config.device)
                },
                //{
                //    header: "Pipes config",
                //    body  : TangoWebapp.ui.newDevicePipeConf(config.device)
                //},
                //{
                //    header: "Attributes properties",
                //    body  : TangoWebapp.ui.newDeviceAttrProps(config.device)
                //},
                {
                    header: "Logging",
                    body  : TangoWebapp.ui.newDeviceLogging(config.device)
                }
            ]
        }
    };
};
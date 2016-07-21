webix.protoUI({
    _device : null,
    name    : "DeviceView",
    $init   : function (config) {
        this._device = config.device;

        //set header Device [...]
    },
    defaults: {
        animate: false
    }
}, webix.IdSpace, webix.ui.tabview);

TangoWebapp.newDeviceView = function (config) {
    return {
        header: "Device [" + config.device.name + "]",
        close : true,
        body  : {
            view : "DeviceView",
            id   : config.id,
            cells: [
                {
                    header: "Info",
                    body  : TangoWebapp.newDeviceInfo(config.device)

                },
                {
                    header: "Properties",
                    body  : TangoWebapp.newDeviceProperties(config.device)
                },
                {
                    header: "Polling",
                    body: TangoWebapp.newDevicePolling(config.device)
                },
                {
                    header: "Events",
                    body  : TangoWebapp.newDeviceEvents(config.device)
                },
                {
                    header: "Attributes config",
                    body  : TangoWebapp.newDeviceAttrConfig(config.device)
                },
                {
                    header: "Pipes config",
                    body  : TangoWebapp.newDevicePipeConf(config.device)
                },
                {
                    header: "Attributes properties",
                    body  : TangoWebapp.newDeviceAttrProps(config.device)
                },
                {
                    header: "Logging",
                    body  : TangoWebapp.newDeviceLogging(config.device)
                }
            ]
        }
    };
};
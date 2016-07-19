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
                    device: config.device,
                    header: "Properties",
                    body  : TangoWebapp.newDeviceProperties(config.device)
                },
                {
                    device: config.device,
                    header: "Polling",
                    body  : TangoWebapp.newDevicePolling()
                },
                {
                    device: config.device,
                    header: "Events",
                    body  : TangoWebapp.newDeviceEvents()
                },
                {
                    device: config.device,
                    header: "Attributes config",
                    body  : TangoWebapp.newDeviceAttrConfig()
                },
                {
                    device: config.device,
                    header: "Pipes config",
                    body  : TangoWebapp.newDevicePipeConf()
                },
                {
                    device: config.device,
                    header: "Attributes properties",
                    body  : TangoWebapp.newDeviceAttrProps()
                },
                {
                    device: config.device,
                    header: "Logging",
                    body  : {
                        view: "Device Logging",
                        id  : "device_logging"
                    }
                }
            ]
        }
    };
};
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

TangoWebapp.ui.newDeviceView = function (config) {
    return {
        header: "Device [" + config.device.name + "]",
        close : true,
        body  : {
            view : "DeviceView",
            id   : config.id,
            cells: [
                {
                    header: "Info",
                    body  : TangoWebapp.ui.newDeviceInfo(config.device)

                },
                {
                    header: "Properties",
                    body  : TangoWebapp.ui.newDeviceProperties(config.device)
                },
                {
                    header: "Polling",
                    body: TangoWebapp.ui.newDevicePolling(config.device)
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
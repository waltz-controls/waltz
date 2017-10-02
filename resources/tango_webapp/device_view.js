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
        header: "<span class='webix_icon fa-microchip'></span>[<span class='webix_strong'>" + config.device.name + "@" + config.device.host.id + "</span>]",
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
                    body: TangoWebapp.ui.newDeviceEventsView(config.device)
                },
                {
                    header: "Attributes config",
                    body: TangoWebapp.ui.newDeviceAttrConfigView(config.device)
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
                    body: TangoWebapp.ui.newDeviceLoggingView(config.device)
                }
            ]
        }
    };
};
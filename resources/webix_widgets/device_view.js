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
        header: "<span class='webix_icon fa-microchip'></span>[<span class='webix_strong'>" + config.device.display_name + "</span>]",
        close : true,
        borderless: true,
        body  : {
            view: "device_view",
            id   : config.id,
            cells: [
                {
                    header: "<span class='tab_bold'>" + "Properties" + "</span>",
                    body: TangoWebapp.ui.newDevicePropertiesView(config.device)
                },
                {
                    header: "<span class='tab_bold'>" + "Polling" + "</span>",
                    body: TangoWebapp.ui.newDevicePollingView(config.device)
                },
                {
                    header: "<span class='tab_bold'>" + "Events" + "</span>",
                    body: TangoWebapp.ui.newDeviceEventsView(config.device)
                },
                {
                    header: "<span class='tab_bold'>" + "Attributes config" + "</span>",
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
                    header: "<span class='tab_bold'>" + "Logging" + "</span>",
                    body: TangoWebapp.ui.newDeviceLoggingView(config.device)
                }
            ]
        }
    };
};
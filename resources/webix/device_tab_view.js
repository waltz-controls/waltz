webix.protoUI({
    name: "DeviceTabView",
    defaults:{
        id:"device_tab_multiview",
        animate: false,
        cells: [
            TangoWebapp.DeviceInfoViewConfig,
            TangoWebapp.DevicePropertiesViewConfig,
            TangoWebapp.DevicePollingViewConfig,
            TangoWebapp.DeviceEventViewConfig,
            TangoWebapp.DeviceAttrConfigViewConfig,
            TangoWebapp.DevicePipeConfViewConfig,
            TangoWebapp.DeviceAttrPropsViewConfig,
            TangoWebapp.DeviceLoggingViewConfig
        ]
    }

},webix.IdSpace, webix.EventSystem, webix.ui.multiview);


TangoWebapp.DeviceTabConfig = webix.ui({
    view: "DeviceTabView"
});
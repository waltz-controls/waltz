webix.protoUI({
    _getUI:function(){
        return {
            rows: [
                {
                    id: "display",
                    view: "datatable",
                    columns: [
                        {header: "Property name"},
                        {header: "Value"}
                    ]

                },

                {
                    view: "toolbar",
                    cols: [
                        {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left"},
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"}]
                }

            ]
        };
    },
    name: "Device Logging",
    $init: function(config){
        webix.extend(config, this._getUI());
    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceTabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.newDeviceLogging = function(device){
    return {
        device : device,
        view: "Device Logging",
        id  : "device_logging"
    }
};
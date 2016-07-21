webix.protoUI({
    _getUI:function(){
        return {
            rows: [
                {
                    id: "logging",
                    view: "datatable",
                    columns: [
                        {id:'name', header: "Property name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                        {id:'value',header: "Value", fillspace: true}
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
    name: "DeviceLogging",
    $init: function(config){
        webix.extend(config, this._getUI());

        //TODO cNp Jive

        this.$ready.push(function(){
            this.$$('logging').parse([
                {
                    name:"Logging level"
                },
                {
                    name:"Current logging level"
                },
                {
                    name:"Logging target"
                },
                {
                    name:"Current logging level"
                },
                {
                    name:"Logging RFT"
                }
            ]);
        });
    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceTabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.newDeviceLogging = function(device){
    return {
        device : device,
        view: "DeviceLogging",
        id  : "device_logging"
    }
};
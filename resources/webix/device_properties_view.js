webix.protoUI({
    name: "Device Properties",
    bind:function(){
        this.$$('device_properties_data').bind(TangoWebapp.devices, '$data', function(device, devices){
            if(!device) return this.clearAll();
            //this.parse(device.properties());
            //TODO load from db
        });
    },
    $init:function(){
        this.$ready.push(this.bind);
    },
    defaults: {
        rows: [
            {
                view: "datatable",
                id:"device_properties_data",
                columns: [
                    {header: "Property name"},
                    {header: "Value"}
                ],
                dataFeed: '...'
            },
            {
                view: "toolbar",
                id: "devPropertiesToolbar",
                cols: [
                    {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left"},
                    {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"},
                    {view: "button", id: "btnNewProperty", value: "New Property", width: 100, align: "left"},
                    {view: "button", id: "btnCopy", value: "Copy", width: 100, align: "left"},
                    {view: "button", id: "btnDelete", value: "Delete", width: 100, align: "left"}]
            }
        ]
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.DevicePropertiesViewConfig = {
    view: "Device Properties",
    id: "device_properties"
};


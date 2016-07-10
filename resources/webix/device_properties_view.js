webix.protoUI({
    name: "Device Properties",
    _newPropertyPopup:webix.ui({
        view:"popup",
        id:"newPropertyPopup",
        body:{
            view:"form",
            id:"newPropertyForm",
            width:300,
            elements:[
                { view:"text", label:"Name", validate:webix.rules.isNotEmpty},
                { view:"text", label:"Value", validate:webix.rules.isNotEmpty},
                { margin:5, cols:[
                    { view:"button", value:"OK" , type:"form", click:function(){
                        this.getTopParentView().$$('newPropertyForm').validate();
                    } },
                    { view:"button", value:"Cancel", click: ("$$('newPropertyPopup').hide();") }
                ]}
            ]
        }
    }),
    bind:function(){
        this.$$('device_properties_data').bind(TangoWebapp.devices, '$data', function(device, devices){
            if(!device) return this.clearAll();


            this.parse(device.properties());
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
                    {id:"name" ,header: "Property name"},
                    {id:"values",header: "Value"}
                ],
                dataFeed: '...'
            },
            {
                view: "toolbar",
                id: "devPropertiesToolbar",
                cols: [
                    {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left", click:function(){
                    }},
                    {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"},
                    {view: "button", id: "btnNewProperty", value: "New Property", width: 100, align: "left", click:("$$('newPropertyPopup').show();")},
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


webix.protoUI({
    name: "Device Properties",
    //show: function (url) {
    //    webix.message("Requesting device properties for " + url);

        //this.$$("header").setValues({name:url}, true);
        //
        //this.$$('device_info_data').loadNext(1,0,webix.bind(function(response){
        //    this.show();
        //    return response.json();
        //},this), url);
    //},
    $init:function(){
        this.$ready.push(function(){
            this.$$('device_properties_data').bind($$('device_tree'), '$data', function(obj, source){
                if (!obj) return this.clearAll();
                var fulldata = [].concat(source.data.getBranch(obj.id)).concat(obj.records);
                this.data.importData(fulldata, true);
            });
        });
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
                data: '',
                on:{

                }
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


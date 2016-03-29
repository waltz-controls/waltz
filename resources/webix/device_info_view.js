webix.protoUI({
    name: "Device Info",
    bind: function(){
        this.$$('device_info_data').bind(TangoWebapp.devices, "$data", function(device, devices){
            this.clearAll();
            if(!device) {
                return;
            }

            this.parse(
                TangoWebapp.db.DbGetDeviceInfo(TangoWebapp.getDevice().name).then(
                    function(response){
                        var info = response.output;
                        return {
                            name: info.svalue[0],
                            type_id: info.svalue[2],
                            oir: info.svalue[1],
                            iiop_version: "1.2",
                            host: info.svalue[4], //TODO jive returns different
                            port: 0,//TODO
                            server: info.svalue[3],
                            server_pid: info.lvalue[1],
                            exported: info.lvalue[0] == 1,
                            last_exported: info.svalue[5],
                            last_unexported: info.svalue[6]
                        }
                    }
                )
            );
        });
    },
    $init: function(){
        this.$ready.push(this.bind);
    },
    defaults: {
        rows: [
            {
                view: "dataview",
                id: "device_info_data",
                template: new View({url: 'views/device_info.ejs'}).render(),
                autoheight: true,
                //autoConfig: true,
                //editable: false,
                //url: 'http://localhost:8080/localhost/rest/rc2/devices/sys/tg_test/1'
                type: {
                    height: "auto",
                    width: "auto"
                },
                dataFeed: "..."
            }]
    }
}, webix.IdSpace, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.DeviceInfoViewConfig = {
    view: "Device Info",
    id: "device_info"
};

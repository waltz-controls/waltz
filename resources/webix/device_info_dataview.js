TangoWebapp.DeviceInfoDataViewConfig = {
    view: "dataview",
    id: "device_info",
    template: new View({url: 'views/device_info.ejs'}).render(),
    autoheight: true,
    //autoConfig: true,
    //editable: false,
    //url: 'http://localhost:8080/localhost/rest/rc2/devices/sys/tg_test/1'
    type: {
        height: "auto",
        width: "auto"
    },
    on: {
        onDataRequest: function (count, start, cbk, url) {
            url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceInfo?input=' + url;
            this.clearAll();
            this.parse(webix.ajax().put(url)
                .then(function (response) {
                    var info = response.json().output;
                    return {
                        name:info.svalue[0],
                        type_id:info.svalue[2],
                        oir:info.svalue[1],
                        iiop_version:"1.2",
                        host:info.svalue[4], //TODO jive returns different
                        port:0,//TODO
                        server:info.svalue[3],
                        server_pid:info.lvalue[1],
                        exported:info.lvalue[0] == 1,
                        last_exported:info.svalue[5],
                        last_unexported:info.svalue[6]
                    }
                        ;
                }
            ), 0);
            return false;
        }
    }
};


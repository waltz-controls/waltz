webix.protoUI({
    name: "DeviceInfo",
    loadAndShow: function (url) {
        webix.message("Requesting device info for " + url);

        this.$$("header").setValues({name:url}, true);

        this.$$('device_info_data').loadNext(1,0,webix.bind(function(response){
            this.show();
            return response.json();
        },this), url);
    },
    defaults: {
        rows: [
            {
                id:"header",
                type: "header",
                template: "Device Info [#name#]"
            },
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
                on: {
                    onBeforeRender:function(obj){
                        var tabbar = $$('mainTabview').getTabbar();
                        tabbar.config.options[0].value = this.getTopParentView().name; //TODO
                        tabbar.refresh();
                    },
                    onDataRequest: function (count, start, cbk, url) {
                        TangoWebapp.db.DbGetDeviceInfo(url, cbk).then(webix.bind(function (response) {
                            var info = response.output;
                            this.clearAll();
                            this.parse({
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
                            });
                        }, this));
                        return false;
                    }
                }
            }]
    }
}, webix.IdSpace, webix.ui.layout);

TangoWebapp.DeviceInfoViewConfig = {
    view: "DeviceInfo",
    id: "device_info"
};

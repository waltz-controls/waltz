MVC.Object.extend(TangoWebapp,{
    getDatabase: function(){
        return TangoWebapp.databases.getItem(TangoWebapp.databases.getCursor())
    },

    getDevice: function () {
        return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
    } ,

    log: function(msg){
        console.log(msg);
        var id = $$('main-log').add({ type: '', value: msg, timestamp: +new Date()});
        $$('main-log').moveTop(id);
    },

    error: function(msg){
        console.error(msg);
        var id = $$('main-log').add({ type: 'ALARM' , value: msg, timestamp: +new Date()});
        $$('main-log').moveTop(id);
    },

    debug: function(msg){
        if(MVC.env() === 'development' || MVC.env() === 'test') {
            console.log(msg);
            var id = $$('main-log').add({type: 'ON', value: msg, timestamp: +new Date()});
            $$('main-log').moveTop(id);
        }
    }
});

MVC.Object.extend(TangoWebapp, {
    helpers : {
        createDatabase: function () {
            var db = new DataBase();//takes values from TangoWebapp.consts
            var dbId = TangoWebapp.databases.add(db);
            TangoWebapp.databases.setCursor(db.id = dbId);
            return db;
        },

        openAtkTab: function(device){
            var atkId = "atk/" + device.id;
            var tabId;
            if (!$$(atkId)) {
                tabId = $$("main-tabview").addView(
                    {
                        header: "ATKPanel [" + device.name + "]",
                        close: true,
                        body: TangoWebapp.ui.newAtkPanel({
                            device: device,
                            id: atkId
                        })
                    }
                );
                $$('main-tabview').getTabbar().attachEvent('onBeforeTabClose', function(id){
                    if(tabId === id) $$(atkId).stop();
                });
            }
            $$(atkId).show();

            //$$(atkId).$$(tabId).activate();
        },

        openDeviceTab: function (device, tabId) {
            var devId = "dev/" + device.id;
            if (!$$(devId)) {
                $$("main-tabview").addView(
                    TangoWebapp.ui.newDeviceView(
                        {
                            device: device,
                            id: devId
                        })
                );
            }
            $$(devId).show();

            $$(devId).$$(tabId).activate();
        },

        openDevicePanel: function (device) {
            webix.ui({
                view: 'DevicePanel',
                device: device
            }).show();
        },

        openSpectrumWindow: function(attr){
            webix.ui({
                view: "window",
                move: true,
                head: {template: 'Plot attribute ['+attr.name+']'},
                width: 1024,
                height: 480,
                body: TangoWebapp.ui.newSpectrumView(attr),
                on: {
                    onHide:function(){
                        this.close();
                    }
                }
            }).show();
        },

        openImageWindow: function(attr){
            webix.ui({
                view: "window",
                move: true,
                head: {template: 'Image attribute ['+attr.name+']'},
                width: 524,
                height: 524,
                body: TangoWebapp.ui.newImageView(attr),
                on: {
                    onHide:function(){
                        this.close();
                    }
                }
            }).show();
        },

        iterate: function (collection, f) {
            var id = collection.getFirstId(),
                last = collection.getLastId();
            if(!id || ! last) return;
            if(id === last) f(id, collection.getItem(id));
            for (; id !== last; id = collection.getNextId(id)) {
                var item = collection.getItem(id);
                f(id, item);
            }
        },

        changeTangoHost: function () {
            var popup;

            var btnOK = function () {
                var form = popup.getChildViews()[1]; //0 - spacer
                TangoWebapp.consts.REST_API_URL = form.getValues()['tango_rest_url'];

                TangoWebapp.rest = new TangoREST(TangoWebapp.consts.REST_API_URL + '/' + TangoWebapp.consts.REST_API_VERSION);

                popup.close();

                $$('device_tree').updateRoot(TangoWebapp.consts.REST_API_URL);
            };

            popup = webix.ui({
                view: "window",
                zIndex: 1,
                toFront: true,
                autoheight: true,
                minWidth: 300,
                body: {
                    view: "form",
                    elements: [
                        {view: "label", label: "Tango REST API URL:"},
                        {view: "text", name: 'tango_rest_url', value: TangoWebapp.consts.REST_API_URL},
                        {view: "button", value: "OK", type: "form", click: btnOK}
                    ]
                },
                on: {
                    onHide: function () {
                        this.close();
                    }
                }
            });

            popup.show();
        },

        serverWizard: function (data) {
            webix.promise.all(data.devices.map(function(dev){
                return TangoWebapp.getDatabase().DbAddDevice([data.server, dev, data.className]).then(function (resp) {
                    webix.message(dev + " has been added.");
                });
            })).then($$('device_tree').updateRoot.bind($$('device_tree')));
        },

        deleteDevice: function (dev) {
            return TangoWebapp.getDatabase().DbDeleteDevice(dev.name);
        }
    }
});
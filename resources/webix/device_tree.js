webix.protoUI({
    updateRoot: function () {
        var db = TangoWebapp.getDatabase();
        this.clearAll();
        this.add({id: 'root', value: db.url, _db: db, webix_kids: true});
        this.loadBranch('root', null, null);
        this.refresh();
    },
    name: "DeviceTree",
    _ctxMenu: webix.ui({
        view: "contextmenu",
        //autoheight: true,
        data: [
            //"Copy",
            //"Paste",
            "Delete",
            {$template: "Separator"},
            "Device info",
            "Monitor device",
            "Test device",
            //"Define device alias",
            {$template: "Separator"},
            "Restart server",
            "Kill server",
            //{$template: "Separator"},
            //"Go to Server node",
            //"Go to Admin device node",
            {$template: "Separator"},
            "Log viewer"
        ],
        on: {
            onItemClick: function (id) {
                var item = this.getContext().obj.getItem(this.getContext().id);
                switch (id) {
                    case "Restart server":
                        TangoWebapp.getDevice().promiseAdmin().then(function(admin){
                            return admin.RestartServer();
                        }).then(TangoWebapp.helpers.log.bind(null,"Device server has been restarted!"));
                        break;
                    case "Kill server":
                        TangoWebapp.getDevice().promiseAdmin().then(function(admin){
                            return admin.Kill();
                        }).then(TangoWebapp.helpers.log.bind(null, "Device server has been killed!!!"));
                        break;
                    case "Monitor device":
                        TangoWebapp.helpers.openAtkTab(TangoWebapp.getDevice());
                        break;
                    case "Device info":
                        TangoWebapp.helpers.openDeviceTab(TangoWebapp.getDevice(), "device_info");
                        break;
                    case "Test device":
                        TangoWebapp.helpers.openDevicePanel(TangoWebapp.getDevice());
                        break;
                    case "Delete":
                        TangoWebapp.helpers.deleteDevice(TangoWebapp.getDevice()).then(function () {
                            this.getContext().obj.remove(this.getContext().id);
                        }.bind(this));
                        break;
                    default:
                        TangoWebapp.error('Not yet implemented!');
                }
            }
        }
    }),
    defaults: {
        //activeTitle:true,
        type: 'lineTree',
        select: true,
        on: {
            onItemDblClick: function (id, e, node) {
                TangoWebapp.helpers.log("DblClick " + id);
                var item = this.getItem(id);
                if (item.$level == 4) {//member
                    TangoWebapp.helpers.openAtkTab(TangoWebapp.getDevice());
                }

            },
            onItemClick: function (id, e, node) {
                var item = this.getItem(id);
                if (item.$level == 4 || item.$level == 5) { //device, Properties, Event etc
                    TangoWebapp.devices.setCursor(item._device_id);//TODO does getItem automatically set cursor???
                    TangoWebapp.helpers.openDeviceTab(TangoWebapp.getDevice(), item._view_id);
                }
            },
            onDataRequest: function (id, cbk, url) {
                var item = this.getItem(id);
                var promise;
                if (id === 'root')//domain
                    promise = TangoWebapp.getDatabase().DbGetDeviceDomainList("*");
                else if (item.$level == 2)//family
                    promise = TangoWebapp.getDatabase().DbGetDeviceFamilyList(item.value + '/*');
                else if (item.$level == 3)//member
                    promise = TangoWebapp.getDatabase().DbGetDeviceMemberList(this.getItem(item.$parent).value + '/' + item.value + '/*');
                else {
                    return false;//ignore member
                }
                if (item) {
                    TangoWebapp.debug("Loading children for " + item.value);
                }
                this.parse(promise.then(this.handleResponse(id, item)));


                return false;//cancel default behaviour
            },
            onBeforeContextMenu: function (id, e, node) {
                var item = this.getItem(id);
                if (item.$level == 4) {//member
                    TangoWebapp.devices.setCursor(item._device_id);
                    this._ctxMenu.show();
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    $init: function () {
        this._ctxMenu.attachTo(this);

        this.$ready.push(this.updateRoot);
    },
    handleResponse: function (parent_id, item) {
        var self = this;
        return function (response) {
            //create device node
            return {
                parent: parent_id,
                data: response.output.map(
                    function (el) {
                        if (item && item.$level == 3) {
                            var db = self.getItem('root')._db;
                            var name = self.getItem(item.$parent).value + "/" + item.value + "/" + el;
                            var deviceId = db.id + '/' + name; //used for model lookup
                            var device;
                            if (!(device = Device.find_one(deviceId))) {
                                device = new Device(name, db.id, db.api);
                                var dev_id = TangoWebapp.devices.add(device);
                                if(dev_id != deviceId){
                                    TangoWebapp.error("dev_id["+dev_id+"] and deviceId["+deviceId+"] must match!");
                                }
                            }
                            //TODO move to helpers
                            return {
                                _view_id: 'device_info',
                                _device_id: deviceId,
                                value: el,
                                data: [
                                    {
                                        value: 'Properties',
                                        _device_id: deviceId,
                                        _view_id: 'device_properties'
                                    },
                                    {
                                        value: 'Polling',
                                        _device_id: deviceId,
                                        _view_id: 'device_polling'
                                    },
                                    {
                                        value: 'Event',
                                        _device_id: deviceId,
                                        _view_id: 'device_events'
                                    },
                                    {
                                        value: 'Attribute config',
                                        _device_id: deviceId,
                                        _view_id: 'device_attr_config'
                                    },
                                    {
                                        value: 'Pipe config',
                                        _device_id: deviceId,
                                        _view_id: 'device_pipe_config'
                                    },
                                    //{
                                    //    value: 'Attribute properties',
                                    //    _device_id: deviceId,
                                    //    webix_kids: true,
                                    //    _view_id: 'device_attr_properties'
                                    //},
                                    {
                                        value: 'Logging',
                                        _device_id: deviceId,
                                        _view_id: 'device_logging'
                                    }
                                ]
                            };
                        } else {
                            return {value: el, webix_kids: true};
                        }
                    })
            }
        };
    },
    //url:TangoWebapp.rest_api_url + '/devices',
    onContext: {}
}, webix.IdSpace, webix.EventSystem, webix.ui.tree);


TangoWebapp.ui.newDeviceTree = function () {
    return {
        view: "DeviceTree",
        id: "device_tree"
    }
};
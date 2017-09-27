webix.protoUI({
    //TODO move in $init
    devices_filter: new DeviceFilter({
        value: ["*/*/*"]
    }),
    setDeviceFilter: function (filter) {
        this.devices_filter = filter;
        //TODO bind
        $$("txtDevicesList").setValue(filter.value.join('\n'));
    },
    updateRoot: function () {
        this.clearAll();

        var self = this;
        var rest_api_host = TangoWebapp.globals.rest_api_host;
        var databases = [];
        TangoWebapp.helpers.iterate(rest_api_host.databases, function (dbId, db) {
            databases.push({
                id: dbId, value: "TANGO_HOST=" + db.host, _db: db, webix_kids: true,
                _ctx: ["Remove"],
                handleCtx: function (id) {
                    //TODO extract rest_api_method: remove
                    //TODO delete TangoHost instance
                    TangoWebapp.globals.rest_api_host.databases.remove(this._db.id);
                    //TODO update cursor
                    $$('device_tree').updateRoot();
                }
            });
        }.bind(self));

        this.parse([{id: 'root', value: "REST API: " + rest_api_host, _value: rest_api_host, data: databases}]);

        this.refresh();
    },
    name: "DeviceTree",
    _ctxMenu: webix.ui({
        view: "contextmenu",
        //autoheight: true,
        data: [],//loaded dynamically, see onBeforeContext
        on: {
            onItemClick: function (id) {
                var item = this.getContext().obj.getItem(this.getContext().id);
                item.handleCtx(id);
            }
        }
    }),
    defaults: {
        //activeTitle:true,
        type: 'lineTree',
        select: true,
        on: {
            onItemDblClick: function (id, e, node) {
                console.log("DblClick " + id);
                var item = this.getItem(id);
                if (item.$level == 4) {//member
                    TangoWebapp.helpers.openAtkTab(TangoWebapp.getDevice());
                }

            },
            onItemClick: function (id, e, node) {
                var item = this.getItem(id);
                if (item.$level == 5 || item.$level == 6) { //device, Properties, Event etc
                    debugger
                    // PlatformContext.devices.setCursor()
                    TangoWebapp.devices.setCursor(item._device_id);//TODO does getItem automatically set cursor???
                    TangoWebapp.helpers.openDeviceTab(TangoWebapp.getDevice(), item._view_id);
                }
            },
            onDataRequest: function (id, cbk, url) {
                var item = this.getItem(id);
                var promise;
                if (id === 'root') {
                    promise = webix.promise.defer();
                    promise.resolve([TangoWebapp.getDatabase()]);
                } else if (item.$level == 2) {//domain
                    promise = webix.promise.all(this.devices_filter.domain_filter.map(function (it) {
                        return item._db.DbGetDeviceDomainList(it);
                    }));
                } else if (item.$level == 3) {//family
                    promise = webix.promise.all(this.devices_filter.getFamilyFilters(item.value).map(function (it) {
                        return item._db.DbGetDeviceFamilyList(it);
                    }));
                } else if (item.$level == 4) {//member
                    promise = webix.promise.all(this.devices_filter.getMemberFilters(this.getItem(item.$parent).value, item.value).map(function (it) {
                        return item._db.DbGetDeviceMemberList(it);
                    }));
                } else {
                    return false;//ignore member
                }
                if (item) {
                    TangoWebapp.debug("Loading children for " + item.value);
                }


                promise.then(this.handleResponse(id, item));


                return false;//cancel default behaviour
            },
            onBeforeContextMenu: function (id, e, node) {
                var item = this.getItem(id);
                if (item.$level == 2 /*tango_host*/ || item.$level == 5 /*member*/) {
                    this._ctxMenu.clearAll();
                    this._ctxMenu.parse(item._ctx);
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

        var handleDb = function () {
            return function () {
                debugger
                var rest_api_host = TangoWebapp.globals.rest_api_host;
                var databases = [];
                TangoWebapp.helpers.iterate(rest_api_host.databases, function (dbId, db) {
                    databases.push({
                        id: dbId, value: "TANGO_HOST=" + db.host, _db: db, webix_kids: true,
                        _ctx: ["Remove"],
                        handleCtx: function (id) {
                            //TODO extract rest_api_method: remove
                            //TODO delete TangoHost instance
                            TangoWebapp.globals.rest_api_host.databases.remove(this._db.id);
                            //TODO update cursor
                            $$('device_tree').updateRoot();
                        }
                    });
                }.bind(this));
                return [{parent: 'root', data: databases}];
            };
        };

        var handleDomainOrFamily = function (what) {
            return function (response) {
                TangoWebapp.debug("Loaded " + what + " " + item.value);
                response.forEach(function (it) {
                    self.parse({
                        parent: parent_id,
                        data: it.output.map(function (el) {
                            TangoWebapp.debug("Adding child " + el);
                            return {value: el, _db: self.getItem(parent_id)._db, webix_kids: true};
                        })
                    });
                });
            }
        };

        var handleMember = function () {
            return function (response) {
                response.forEach(function (it) {
                    self.parse(
                        {
                            parent: parent_id,
                            data: it.output.map(
                                function (el) {
                                    var db = self.getItem(item.$parent)._db;
                                    var name = self.getItem(item.$parent).value + "/" + item.value + "/" + el;
                                    var deviceId = db.id + '/' + name; //used for model lookup
                                    var device;
                                    //TODO extract helper method getDevice
                                    if (!(device = Device.find_one(deviceId))) {
                                        device = new Device(name, db.id, db.api);
                                        var dev_id = TangoWebapp.devices.add(device);
                                        if (dev_id != deviceId) {
                                            TangoWebapp.error("dev_id[" + dev_id + "] and deviceId[" + deviceId + "] must match!");
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
                                        ],
                                        _ctx: [
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
                                        handleCtx: function (id) {
                                            TangoWebapp.devices.setCursor(this._device_id);
                                            switch (id) {
                                                case "Restart server":
                                                    TangoWebapp.getDevice().promiseAdmin().then(function (admin) {
                                                        return admin.RestartServer();
                                                    }).then(TangoWebapp.helpers.log.bind(null, "Device server has been restarted!"));
                                                    break;
                                                case "Kill server":
                                                    TangoWebapp.getDevice().promiseAdmin().then(function (admin) {
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
                                    };
                                })
                        }
                    );
                });
            }
        };

        switch (item.$level) {
            case 0:
                alert("root");
                break;
            case 1:
                return handleDb();
            case 2:
                return handleDomainOrFamily("domain");
            case 3:
                return handleDomainOrFamily("family");
            case 4:
                return handleMember();
            case 5:
                alert("leaf: " + item.value);
                break;
        }
        return function (response) {
            alert("Unexpected");
            debugger;
        };
    },
    //url:TangoWebapp.rest_api_url + '/devices',
    onContext: {}
}, webix.IdSpace, webix.EventSystem, webix.ui.tree);


TangoWebapp.ui.newDeviceTree = function () {
    return {
        width: 300,
        rows: [
            {
                view: "text",
                id: "txtFilter",
                label: "<span class='webix_icon fa-filter' style='padding-left: 10px;'></span>",
                labelWidth: 32,
                placeholder: "leave empty to discard",
                value: "",
                on: {
                    onTimedKeyPress: function () {
                        $$("device_tree").filter("#value#", this.getValue());
                    }
                }
            },
            {
                id: "device_tree",
                view: "DeviceTree"
            }
        ]
    };
};
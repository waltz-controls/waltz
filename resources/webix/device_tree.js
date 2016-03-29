webix.protoUI({
    name: "DeviceTree",
    _ctxMenu:webix.ui({
        view: "contextmenu",
        autoheight: true,
        on: {
            onItemClick: function (id) {
                var item = this.getContext().obj.getItem(this.getContext().id);
                switch(id){
                    case "Test device":{
                        $$("testDeviceWindow").getHead().setValues({name:item._name}, true); //TODO event
                        $$("testDeviceWindow").show();
                        break;
                    }
                    default:
                        debugger;
                }
            }
        }
        }),
    _ctxMember: [
            "Copy",
            "Paste",
            "Delete",
            {$template: "Separator"},
            "Monitor device",
            "Test device",
            "Define device alias",
            "Restart device",
            {$template: "Separator"},
            "Go to Server node",
            "Go to Admin device node",
            {$template: "Separator"},
            "Log viewer"
        ],
    defaults: {
        //activeTitle:true,
        type: 'lineTree',
        select:true,
        data:''
    },
    $init: function () {
        for(var e in this.on){
            if(this.on.hasOwnProperty(e))
                this.attachEvent(e, this.on[e]);
        }

        this._ctxMenu.attachTo(this);

        this.loadBranch(0, null, null);
    },
    handleResponse: function (parent_id, item) {
        var self = this;
        return function (response) {
            return {
                parent: parent_id,
                data: response.output.map(
                    function (el) {
                        if (item && item.$level == 2) {
                            var name = self.getItem(item.$parent).value + "/" + item.value + "/" + el;
                            if(Device.find_one(name)) debugger;
                            var device = new Device(name);
                            var dev_id = TangoWebapp.devices.add(device);
                            return {
                                _view_id:'device_info',
                                _device_id: dev_id,
                                value: el,
                                data: [
                                    {
                                        value: 'Properties',
                                        _device_id: dev_id,
                                        _view_id: 'device_properties'
                                    },
                                    {
                                        value: 'Polling',
                                        _device_id: dev_id,
                                        _view_id: 'device_polling'
                                    },
                                    {
                                        value: 'Event',
                                        _device_id: dev_id,
                                        _view_id: 'device_events'
                                    },
                                    {
                                        value: 'Attribute config',
                                        _device_id: dev_id,
                                        _view_id: 'device_attr_config'
                                    },
                                    {
                                        value: 'Pipe config',
                                        _device_id: dev_id,
                                        _view_id: 'device_pipe_config'
                                    },
                                    {
                                        value: 'Attribute properties',
                                        _device_id: dev_id,
                                        webix_kids: true,
                                        _view_id: 'device_attr_properties'
                                    },
                                    {
                                        value: 'Logging',
                                        _device_id: dev_id,
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
    onContext: {},
    on: {
        onItemDblClick:function(id, e, node){
            webix.message("DblClick " + id);
            var item = this.getItem(id);
            if(item.$level == 3) {//member
                if(!$$("atk" + id)) {
                    $$("mainTabview").addView(
                        {
                            header: "ATKPanel [" + item._name + "]",
                            close: true,
                            body: {
                                view: "ATKPanel",
                                id: "atk" + id
                            }
                        }
                    );
                }
                $$("atk" + id).show();
            }

        },
        onItemClick: function (id, e, node) {
            var item = this.getItem(id);
            if (item.$level == 3 || item.$level == 4) { //device, Properties, Event etc
                TangoWebapp.devices.setCursor(item._device_id);
                $$(item._view_id).activate();
            }
        },
        onDataRequest: function (id, cbk, url) {
            var item = this.getItem(id);
            if (item) webix.message("Getting children of " + item.value);
            var promise;
            if (id == 0)//domain
                promise = TangoWebapp.db.DbGetDeviceDomainList("*");
            else if (item.$level == 1)//family
                promise = TangoWebapp.db.DbGetDeviceFamilyList(item.value + '/*');
            else if (item.$level == 2)//member
                promise = TangoWebapp.db.DbGetDeviceMemberList(this.getItem(item.$parent).value + '/' + item.value + '/*');
            else {
                return false;//ignore member
            }
            if (item) {
                webix.message("Getting children of " + item.value);


            }
            this.parse(promise.then(this.handleResponse(id, item)));


            return false;//cancel default behaviour
        },
        onBeforeContextMenu: function (id, e, node) {
            var item = this.getItem(id);
            if (item.$level == 3) {//member
                var url = this.getItem(this.getItem(item.$parent).$parent).value + '/' + this.getItem(item.$parent).value + '/' + item.value;
                this._ctxMenu.clearAll();
                this._ctxMenu.parse(this._ctxMember);
                return true;
            } else {
                return false;
            }
        }
    }
}, webix.IdSpace, webix.EventSystem, webix.ui.tree);


TangoWebapp.DeviceTreeConfig = {
    view: "DeviceTree",
    id: "device_tree"
};
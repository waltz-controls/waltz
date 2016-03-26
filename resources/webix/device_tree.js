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
        type: 'lineTree'
    },
    $init: function () {
        for(var e in this.on){
            if(this.on.hasOwnProperty(e))
                this.attachEvent(e, this.on[e]);
        }
        //this.attachEvent('onItemDblClick', this.on.onItemDblClick);
        //this.attachEvent('onDataRequest', this.on.onDataRequest);
        //this.attachEvent('onItemClick', this.on.onItemClick);
        //this.attachEvent('onBeforeContextMenu', this.on.onBeforeContextMenu);

        this._ctxMenu.attachTo(this);

        this.loadBranch(0, null, null);
    },
    handleResponse: function (parent_id, item) {
        var that = this;
        return function (response) {
            return {
                parent: parent_id,
                data: response.output.map(
                    function (el) {
                        if (item && item.$level == 2) {
                            return {
                                _name: that.getItem(item.$parent).value + "/" + item.value + "/" + el,
                                value: el,
                                data: [
                                    {
                                        value: 'Properties',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                            //TODO load
                                        }
                                    },
                                    {
                                        value: 'Polling',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
                                    },
                                    {
                                        value: 'Event',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
                                    },
                                    {
                                        value: 'Attribute config',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
                                    },
                                    {
                                        value: 'Pipe config',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
                                    },
                                    {
                                        value: 'Attribute properties',
                                        webix_kids: true,
                                        handleClick: function () {
                                            //TODO load device attribute properties
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
                                    },
                                    {
                                        value: 'Logging',
                                        handleClick: function () {
                                            var thisView = $$(this.value);
                                            thisView.show();
                                            thisView.getParentView().show();
                                        }
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
            if (item.$level == 3) {//member
                //var url = this.getItem(this.getItem(item.$parent).$parent).value + '/' + this.getItem(item.$parent).value + '/' + item.value;
                var name = item._name;

                var url = TangoWebapp.rest_api_url + "/device/" + name;
                if(!Device.find_one(url)) new Device({url:url});

                $$('device_info').loadAndShow(url);
            } else if (item.$level == 4) { //Properties, Event etc
                item.handleClick();
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
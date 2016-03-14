webix.protoUI({
    name: "DeviceTree",
    defaults:{
        //activeTitle:true,
        type:'lineTree'
    },
    $init:function(){
        this.attachEvent('onDataRequest',this.on.onDataRequest);
        this.attachEvent('onItemClick',this.on.onItemClick);


        this.loadBranch(0, null, null);
    },
    handleResponse:function(parent_id, level){
        return function(response){
            return {
                parent: parent_id,
                data: response.output.map(
                    function (el) {
                        if (level == 2) {
                            return {
                                value: el, data: [
                                    {
                                        value: 'Properties',
                                        handleClick: function () {
                                            $$(this.value).show();
                                            //TODO load
                                        }
                                    },
                                    {
                                        value: 'Polling',
                                        handleClick: function () {
                                            $$(this.value).show();
                                        }
                                    },
                                    {
                                        value: 'Event',
                                        handleClick: function () {
                                            $$(this.value).show();
                                        }
                                    },
                                    {
                                        value: 'Attribute config',
                                        handleClick: function () {
                                            $$(this.value).show();
                                        }
                                    },
                                    {
                                        value: 'Pipe config',
                                        handleClick: function () {
                                            $$(this.value).show();
                                        }
                                    },
                                    {
                                        value: 'Attribute properties',
                                        webix_kids: true,
                                        handleClick: function () {
                                            //TODO load device attribute properties
                                            $$(this.value).show();
                                        }
                                    },
                                    {
                                        value: 'Logging',
                                        handleClick: function () {
                                            $$(this.value).show();
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
    on:{
        onItemClick:function(id, e, node){
            var item = this.getItem(id);
            if(item.$level == 3) {//member
                var url = this.getItem(this.getItem(item.$parent).$parent).value + '/' + this.getItem(item.$parent).value + '/' + item.value;
                $$('device_info').loadAndShow(url);
            } else if(item.$level == 4){ //Properties, Event etc
                item.handleClick();
            }
        },
        onDataRequest:function(id, cbk, url){
            var item = this.getItem(id);
            var level = item ? item.$level: 0;
            if(item) webix.message("Getting children of " + item.value);
            var promise;
            if(id == 0)//domain
                promise = TangoWebapp.db.DbGetDeviceDomainList("*");
            else if(item.$level == 1)//family
                promise = TangoWebapp.db.DbGetDeviceFamilyList(item.value + '/*');
            else if(item.$level == 2)//member
                promise = TangoWebapp.db.DbGetDeviceMemberList(this.getItem(item.$parent).value + '/'+ item.value + '/*');
            else {
                return false;//ignore member
            }
            if(item) {
                webix.message("Getting children of " + item.value);


            }
            this.parse(promise.then(this.handleResponse(id, level)));


            return false;//cancel default behaviour
        }
    }
},webix.IdSpace, webix.EventSystem, webix.ui.tree);


    TangoWebapp.DeviceTreeConfig = {
        view: "DeviceTree",
        id: "device_tree"
    };
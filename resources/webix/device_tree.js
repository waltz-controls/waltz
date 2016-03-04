TangoWebapp.DeviceTreeConfig = {
    view: "tree",
    id:"device_tree",
    activeTitle:true,
    type:'lineTree',
    //url:TangoWebapp.rest_api_url + '/devices',
    on:{
        onItemClick:function(id, e, node){
            var item = this.getItem(id);
            if(item.$level == 3) {//member
                $$('device_info').loadNext(1,0,null,this.getItem(this.getItem(item.$parent).$parent).value + '/' + this.getItem(item.$parent).value + '/'+ item.value);
            }
        },
        onDataRequest:function(id, cbk, url){
            var item = this.getItem(id);
            if(item) webix.message("Getting children of " + item.value);
            if(id == 0)//domain
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceDomainList?input=*';
            else if(item.$level == 1)//family
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceFamilyList?input=' + item.value + '/*';
            else if(item.$level == 2)//member
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceMemberList?input=' + this.getItem(item.$parent).value + '/'+ item.value + '/*';
            else {

                return false;//TODO load aka jive or stop
            }

            var me = this;
            this.parse(
                webix.ajax().put(url)
                    .then(function(response){
                        return {
                            parent: id,
                            data: response.json().output.map(function(el){ return {value:el,webix_kids:true}})
                        };
                    }));


            return false;//cancel default behaviour
        }
    }
};

TangoWebapp.DeviceTreeConfig = {
    view: "tree",
    id:"device_tree",
    ITEM_ID:1,
    activeTitle:true,
    type:'lineTree',
    //url:TangoWebapp.rest_api_url + '/devices',
    on:{
        onItemClick:function(id, e, node){
            if(id == 'root'){
                alert('root is clicked');
            } else {
                //TODO load/expand
            }
        },
        onDataRequest:function(id, cbk, url){
            webix.message("Getting children of " + id);
            var item = this.getItem(id);
            if(id == 0)//domain
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceDomainList?input=*';
            else if(item.$level == 1)//family
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceFamilyList?input=' + item.value + '/*';
            else if(item.$level == 2)//member
                url = TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceMemberList?input=' + this.getItem(item.$parent).value + '/'+ item.value + '/*';
            else return false;//TODO load aka jive or stop

            var me = this;
            this.parse(
                webix.ajax().put(url)
                    .then(function(response){
                        return {
                            parent: id,
                            data: response.json().output.map(function(el){ return {id:me.ITEM_ID++,value:el,webix_kids:true}})
                        };
                    }));


            return false;//cancel default behaviour
        }
    }
};

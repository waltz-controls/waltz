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

            this.parse(promise.then(function(response){
                        return {
                            parent: id,
                            data: response.output.map(function(el){ return {value:el,webix_kids:true}})
                        };
                    }));


            return false;//cancel default behaviour
        }
    }
};

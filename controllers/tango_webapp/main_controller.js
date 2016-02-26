/**
* Main controller
*
* @type {TangoWebapp.MainController}
*/
TangoWebapp.MainController = MVC.Controller.extend('main',{
    /**
    * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
    *
    * @param {Object} params
    */
    load: function(params){
        //TODO jsTangORB must be migrated to ajax first
        //TangoWebapp.db = new DataBase('http://localhost:8080/localhost/rest/rc2','sys/database/2');
        //TODO ask user for rest_host
        TangoWebapp.rest_api_url = 'http://localhost:8080/localhost/rest/rc2';
        //draw ui
    	webix.ui({
            rows:[
                { view:"template",
                    type:"header", template:"Tango Web Application" },
                {
                    cols: [
                        {
                            view: "tabview",
                            cells: [
                                {
                                    header: "Device",
                                    body: TangoWebapp.DeviceTreeConfig
                        },
                        {
                            header: "Server",
                            body: TangoWebapp.ServerTreeConfig
                }
            ]
            },
                        {view:"resizer"},
                        {
                            view: "datatable",
                            autoConfig: true,
                            editable: false,
                            url: 'http://localhost:8080/localhost/rest/rc2/devices/sys/tg_test/1'
                        }


                    ]
                },
                {view:"resizer"},
                {
                    view: "datatable",
                    autoConfig: true,
                    data:[]
                }
            ]
        });


        $$('device_tree').loadBranch(0, null, TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceDomainList?input=*');

        //webix.ajax().put(TangoWebapp.rest_api_url + '/devices/sys/database/2/commands/DbGetDeviceDomainList?input=*')
        //    .then(function(response){
        //        var data = response.json().output.map(function(el){ return {id:el, value:el, webix_kids:true}});
        //        $$('device_tree').parse(data);
        //    })
        //    .fail(function(response){
        //        webix.message('DbGetDeviceDomainList has failed!');
        //    });
    }
});
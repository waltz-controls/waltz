/**
 * Main controller
 *
 * @type {TangoWebapp.MainController}
 */
TangoWebapp.MainController = MVC.Controller.extend('main', {
    /**
     * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
     *
     * @param {Object} params
     */
    load: function (params) {
        //TODO jsTangORB must be migrated to ajax first
        //TangoWebapp.db = new DataBase('http://localhost:8080/localhost/rest/rc2','sys/database/2');
        //TODO ask user for rest_host
        TangoWebapp.rest_api_url = 'http://localhost:8080/localhost/rest/rc2';
        TangoWebapp.db = new DataBase(TangoWebapp.rest_api_url, 'sys/database/2');
        //draw ui
        webix.ui({
            rows: [
                TangoWebapp.ToolbarConfig,
                {
                    cols: [
                        {
                            view: "tabview",
                            width: 250,
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
                        {view: "resizer"},
                        {
                            view: "tabview",
                            id: "mainTabview",
                            cells: [
                                {
                                    view: "multiview",
                                    id: "device_multiview",
                                    animate: false,
                                    cells: [
                                        TangoWebapp.DeviceInfoViewConfig,
                                        TangoWebapp.DevicePropertiesViewConfig,
                                        TangoWebapp.DevicePollingViewConfig,
                                        TangoWebapp.DeviceEventViewConfig,
                                        TangoWebapp.DeviceAttrConfigViewConfig,
                                        TangoWebapp.DevicePipeConfViewConfig,
                                        TangoWebapp.DeviceAttrPropsViewConfig,
                                        TangoWebapp.DeviceLoggingViewConfig
                                    ]
                                }
                            ]
                        }


                    ]
                }
            ]
        });


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
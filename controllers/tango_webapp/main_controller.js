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
        //TODO ask user for rest_host
        TangoWebapp.rest_api_url = 'http://localhost:8080/hzgxenvtest.desy.de/rest/rc2';
        TangoWebapp.rest = new TangoREST(TangoWebapp.rest_api_url);


        TangoWebapp.db = new DataBase('sys/database/2');
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


        $$("Properties").$$('device_properties_data').bind($$('device_tree'), '$data', function(obj, source){
            if (!obj) return this.clearAll();
            var fulldata = [].concat(source.data.getBranch(obj.id)).concat(obj.records);
            this.data.importData(fulldata, true);
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
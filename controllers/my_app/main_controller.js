/**
* Main controller
*
* @type {MyApp.MainController}
*/
MyApp.MainController = MVC.Controller.extend('main',{
    /**
    * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
    *
    * @param {Object} platform
    */
    buildUI: function(platform){
    	var ui_builder = platform.ui_builder;

        ui_builder.add_mainview_item({
            header: "<span class='webix_icon fa-dashboard'></span> My Dashboard",
            borderless: true,
            body: newMyDashboard({id: 'my_dashboard'})
        });
    }
});
/**
 * Controller
 *
 * @type {DeviceTreeController}
 */
DeviceTreeController = MVC.Controller.extend('device_tree_controller',
/* @Static */
{},
/* @Prototype */
{
    "credentials.create.as_existing subscribe": function (data) {
        var filter = DeviceFilter.find_one(data.data.name);
        if(filter != null) {
            TangoWebapp.debug("Setting device filter for " + data.data.name);
            $$("device_tree").setDeviceFilter(filter);
            $$("device_tree").updateRoot();
        } else {
            TangoWebapp.debug("DeviceFilter for user is not found!");
        }

    },
    "credentials.destroy subscribe": function () {
        $$("device_tree").setDeviceFilter(DeviceFilter.find_one("default"));
        $$("device_tree").updateRoot();
        TangoWebapp.debug("Resetting device filter to default");
    }
}
);
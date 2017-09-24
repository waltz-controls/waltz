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
    "tango_webapp.user_context.rest_api_changed subscribe": function (data) {
        //TODO update tree root
        alert("device_tree.rest_api_change")
    }
}
);
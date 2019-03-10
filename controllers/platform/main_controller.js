/**
 * Main controller
 *
 * @type {TangoWebappPlatform.MainController}
 */
TangoWebappPlatform.MainController = class extends MVC.Controller {
    _dispatch(what, platform_api){
        MVC.Controller.controllers.main
            .filter(function(ctrl) { return what in ctrl.prototype})
            .forEach(function(ctrl) {
                //TODO setTimeoutor Promise
                ctrl.dispatch(what, platform_api)
            }
                );
    }
    "platform_context.create subscribe"(event){
        var platform_api = new TangoWebappPlatform.PlatformApi({
            context: event.data,
            ui_builder: {}
        });

        this._dispatch("buildUI", platform_api);
        platform_api.ui_builder.build();
        window.PlatformApi = platform_api;
        this._dispatch("initialize", platform_api);
    }
    "platform_context.set_rest subscribe"(event) {
        var rest = event.data.rest;

        rest.isAlive()
            .then(function (rest) {
                TangoWebappHelpers.log("TangoWebapp has been loaded!");
                TangoWebappHelpers.log("TangoWebapp version=" + TangoWebappPlatform.consts.VERSION);
            })
            .fail(function (rest) {
                webix.ui(TangoWebapp.ui.newCriticalErrorWindow(rest)).show();
            })
    }
    /**
     * Refreshes device in the context
     *
     * @param event
     */
    "tango_webapp.device_loaded subscribe"(event) {
        if (PlatformContext.devices.exists(event.data.id)) {
            PlatformContext.devices.updateItem(event.data.id, event.data);
        } else {
            PlatformContext.devices.add(event.data);
        }
    }
    "tango_webapp.tango_host_loaded subscribe"(event) {
        if (PlatformContext.tango_hosts.exists(event.data.id)) {
            PlatformContext.tango_hosts.updateItem(event.data.id, event.data);
        } else {
            PlatformContext.tango_hosts.add(event.data);
        }
    }
    "user_context_controller.delete_tango_host subscribe"(event) {
        PlatformContext.tango_hosts.remove(event.data);
    }
};

TangoWebappPlatform.MainController.initialize();
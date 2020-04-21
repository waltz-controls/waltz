function updatePollableHelper(pollable){
    const device = PlatformContext.devices.getItem(pollable.device_id);
    if(device === undefined) return;
    let pollables;
    if(pollable.Class.className === 'tango_command')
        pollables = device.commands;
    else if(pollable.Class.className === 'tango_attribute')
        pollables = device.attrs;
    else return;
    if(pollables.getItem(pollable.id) != null)//TODO currently this can happen with db device
        pollables.updateItem(pollable.id, {
            polled: pollable.polled,
            poll_rate: pollable.poll_rate
        });
}

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

    //TODO use sync not only for polling
    "tango_command.update subscribe"(event){
        const pollable = event.data;
        updatePollableHelper(pollable)
    }
    "tango_attribute.update subscribe"(event) {
        const pollable = event.data;
        updatePollableHelper(pollable);
    }
};

TangoWebappPlatform.MainController.initialize();
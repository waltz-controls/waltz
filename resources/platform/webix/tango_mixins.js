MVC.Object.extend(TangoWebapp.mixin, {
    /**
     *
     * Requires `on` property to be defined
     */
    OpenAjaxListener: {
        _listener_controller: null,
        _listener_instance: null,
        $init: function (config) {
            this._listener_controller = MVC.Controller.extend(config.id, this, this.defaults.on);
            this._listener_instance = new this._listener_controller();
        }
    },

    TabActivator: {
        _is_active: false,
        activate: function () {
            this.show(true);
            this._is_active = true;
        }
    },

    DeviceSetter: {
        device_setter: function (device) {
            if (!device) TangoWebapp.error("device can not be undefined");
            this._device = device;
            return device;
        }
    }
});
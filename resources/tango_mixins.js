MVC.Object.extend(TangoWebapp, {
    mixin: {
        TabActivator: {
            _isActive: false,
            activate: function () {
                this.show(true);
                this._isActive = true;
            }
        },

        DeviceSetter: {
            device_setter: function (device) {
                webix.assert(device, "device can not be undefined");
                this._device = device;
                return device;
            }
        }
    }
});
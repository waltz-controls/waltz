MVC.Object.extend(TangoWebapp, {
    mixin: {
        TabActivator: {
            activate: function () {
                this.show(true);
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
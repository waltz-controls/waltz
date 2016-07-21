TangoWebapp.mixin = {};

TangoWebapp.mixin.DeviceTabActivator = {
    activate:function(){
        this.getParentView().show();
        this.show();
    }
};

TangoWebapp.mixin.DeviceSetter = {
    device_setter: function (device) {
        webix.assert(device, "device can not be undefined");
        this._device = device;
        return device;
    }
};
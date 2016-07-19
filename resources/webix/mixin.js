TangoWebapp.DeviceTabActivator = {
    activate:function(){
        this.getParentView().show();
        this.show();
    }
};

TangoWebapp.DeviceSetter = {
    device_setter: function (device) {
        this._device = device;
        return device;
    }
};
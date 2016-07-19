TangoWebapp.getDevice = function () {
    return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
};

TangoWebapp.openDevicePanel = function (device) {
    webix.ui({
        view: 'Device Panel',
        device: device
    }).show();
};
TangoWebapp.helpers = {};

TangoWebapp.helpers.getDevice = function () {
    return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
};

TangoWebapp.helpers.openDevicePanel = function (device) {
    webix.ui({
        view: 'Device Panel',
        device: device
    }).show();
};

TangoWebapp.helpers.iterate = function(collection, f){
    for(var id = collection.getFirstId(), last = collection.getLastId(); id != last; id = collection.getNextId(id)){
        var item = collection.getItem(id);
        f(id, item);
    }
};
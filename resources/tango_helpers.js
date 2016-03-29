TangoWebapp.getDevice = function(){
    return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
};
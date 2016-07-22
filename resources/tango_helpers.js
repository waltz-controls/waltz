TangoWebapp.helpers = {

    getDevice: function () {
        return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
    },

    openDevicePanel: function (device) {
        webix.ui({
            view: 'Device Panel',
            device: device
        }).show();
    },

    iterate: function (collection, f) {
        for (var id = collection.getFirstId(), last = collection.getLastId(); id != last; id = collection.getNextId(id)) {
            var item = collection.getItem(id);
            f(id, item);
        }
    },

    changeTangoHost: function () {
        var popup;

        var btnOK = function () {
            var form = popup.getChildViews()[0];
            var newTangoRestApiUrl = form.getValues()['tango_rest_url'];

            TangoWebapp.rest = new TangoREST(newTangoRestApiUrl + '/' + TangoWebapp.consts.REST_API_VERSION);

            popup.close();

            $$('device_tree').updateRoot(newTangoRestApiUrl);
        };

        popup = webix.ui({
            view: "popup",
            zIndex:1,
            toFront: true,
            autoheight: true,
            minWidth: 300,
            body: {
                view: "form",
                elements: [
                    {view: "label", label: "Tango REST API URL:"},
                    {view: "text", name:'tango_rest_url', value: TangoWebapp.consts.REST_API_URL},
                    {view: "button", value: "OK", type: "form", click: btnOK}
                ]
            },
            on:{
                onHide:function(){
                    this.close();
                }
            }
        });

        popup.show();
    }
};

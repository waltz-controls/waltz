/**
 *
 * @type {TangoHost}
 */
TangoWebapp.TangoHost = TangoWebapp.DataCollectionWrapper.extend("tango_host",
    /*@Static */
    {
        attributes: {
            host: "string",
            port: "number",
            name: "string",
            id: "string", //host:port
            info: "string[]"
        },
        default_attributes: {}
    },
    /*@Prototype */
    {
        rest: null,
        /**
         *
         * @param attrs
         * @constructor
         */
        init: function (attrs) {
            this._super(attrs);
            this.devices = new webix.DataCollection();
        },
        toString: function () {
            return this.id;
        },
        toUrl: function () {
            return this.host + "/" + this.port;
        },
        addDevice: function (device) {
            this.value.add(device);
            this.value.setCursor(device.id);
        },
        /**
         *
         * @event {OpenAjax} tango_webapp.device_loaded
         * @param name
         */
        fetchDevice: function (name) {
            return this.rest.request().hosts(this.toUrl()).devices(name).get().then(function (resp) {
                //jmvc fails to set "attributes" due to already existing function in the model
                var attrs = resp.attributes;
                delete resp.attributes;

                var device = new TangoWebapp.TangoDevice(MVC.Object.extend(resp, {
                    attrs: attrs,
                    id: this.id + "/" + name,
                    host: this
                }));
                this.addDevice(device);
                OpenAjax.hub.publish("tango_webapp.device_loaded", {data: device});
                return device;
            }.bind(this));
        }
    }
);

if (window['TangoHost'] === undefined)
    TangoHost = TangoWebapp.TangoHost;
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
        database: null,
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
        //TODO ??? name or id
        getDevice: function (name) {
            return this.value.getItem(this.id + "/" + name);
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
        },
        /**
         *
         * @ebent {OpenAjax} tango_webapp.database_loaded
         * @return {Promise}
         */
        fetchDatabase: function () {
            return this.fetchDevice(this.name).then(function (db) {
                this.database = new TangoWebapp.TangoDatabase({
                    id: db.id,
                    device: db,
                    info: this.info
                });
                OpenAjax.hub.publish("tango_webapp.database_loaded", {data: this.database});
                return this.database;
            }.bind(this));
        }
    }
);

if (window['TangoHost'] === undefined)
    TangoHost = TangoWebapp.TangoHost;
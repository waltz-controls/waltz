/**
 *
 * @type {TangoHost}
 */
TangoWebappPlatform.TangoHost = MVC.Model.extend("tango_host",
    /** @Static */
    {
        attributes: {
            host: "string",
            port: "number",
            name: "string",
            id: "string", //host:port
            info: "string[]",
            is_alive: 'boolean'
        },
        default_attributes: {
            id: 'not selected',
            host: 'unknown',
            port: 0,
            name: 'unknown',
            info: [],
            is_alive: false
        }
    },
    /** @Prototype */
    {
        rest: null,
        database: null,
        toString: function () {
            return this.id;
        },
        toUrl: function () {
            return this.host + "/" + this.port;
        },
        /**
         *
         * @event {OpenAjax} tango_webapp.device_loaded
         *
         * @param name
         * @return {Promise} device
         */
        fetchDevice: function (name) {
            return this.fetchDatabase()
                .then(function (db) {
                    return db.getDeviceInfo(name);
                })
                .then(function (info) {
                    var device = new TangoWebappPlatform.TangoDevice({
                        info: info,
                        id: this.id + "/" + name,
                        name: name,
                        host: this
                    });
                    OpenAjax.hub.publish("tango_webapp.device_loaded", {data: device});
                    return device;
                }.bind(this));
        },
        /**
         *
         * @event {OpenAjax} tango_webapp.database_loaded
         * @return {Promise} database
         */
        fetchDatabase: function () {
            return this.rest.request().hosts(this.toUrl()).devices(this.name).get()
                .then(function (resp) {
                        //jmvc fails to set "attributes" due to already existing function in the model
                        delete resp.attributes;

                        var device = new TangoWebappPlatform.TangoDevice(MVC.Object.extend(resp, {
                            id: this.id + "/" + this.name,
                            name: this.name,
                            host: this
                        }));

                    this.is_alive = true;
                    this.errors = [];
                    OpenAjax.hub.publish("tango_webapp.tango_host_loaded", {data: this});
                        return device;
                    }.bind(this)
                ).fail(function (resp) {
                    this.is_alive = false;
                        this.add_errors(resp.errors);
                        throw resp;
                    }.bind(this)
                ).then(function (device) {
                    OpenAjax.hub.publish("tango_webapp.device_loaded", {data: device});//TODO use PlatformContext directly?
                    this.database = new TangoWebappPlatform.TangoDatabase({
                        id: device.id,
                        device: device,
                        info: this.info
                    });
                    OpenAjax.hub.publish("tango_webapp.database_loaded", {data: this.database});
                    return this.database;
                }.bind(this));
        }
    }
);

//TODO move to separate file: compatibility
if (window['TangoHost'] === undefined)
    TangoHost = TangoWebappPlatform.TangoHost;
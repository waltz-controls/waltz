/**
 * Model tango_host
 * @class
 * @type {TangoHost}
 * @property {string} host
 * @property {number} port
 * @property {string} name
 * @property {string} id
 * @property {string[]} info
 * @property {boolean} is_alive
 * @property {TangoDeviceAlias[]} aliases
 * @property {TangoDomain[]} domains
 * @property {TangoFamily[]} families
 * @property {TangoMember[]} members
 * @extends MVC.Model
 */
TangoWebappPlatform.TangoHost = MVC.Model.extend("tango_host",
    /** @lends  TangoWebappPlatform.TangoHost */
    {
        attributes: {
            host: "string",
            port: "number",
            name: "string",
            id: "string", //host:port
            info: "string[]",
            is_alive: 'boolean',
            aliases: 'TangoDeviceAlias[]',
            domains: 'TangoDomain[]',
            families: 'TangoFamily[]',
            members: 'TangoMember[]'
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
    /** @lends  TangoWebappPlatform.TangoHost.prototype */
    {
        /** @member {rest} */
        rest: null,
        /** @member {database} */
        database: null,
        /**
         * @return {string} host + "/" + port
         */
        toString: function () {
            return this.id;
        },
        /**
         *
         * @param attrs
         * @constructs
         */
        init:function (attrs) {
            this._super(attrs);

            this.aliases = new webix.DataCollection();
        },
        /**
         * @return {string} device
         */
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
                    return webix.promise.all(
                        [
                            db.getDeviceInfo(name),
                            db.getDeviceAlias(name).fail(function(){
                                return "";
                            })
                        ]);
                })
                .then(function (info) {
                    var device = new TangoWebappPlatform.TangoDevice({
                        info: info[0],
                        alias: info[1],
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
            if(this.database != null) return webix.promise.resolve(this.database);
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
        },
        /**
         *
         * @return {Promise<TangoDeviceAlias[]>}
         */
        fetchAliases:function(){
            return this.fetchDatabase()
                .then(function(db){
                    return db.getDeviceAliasList();
                })
                .then(function(aliases){
                    debugger
                    var aliases = TangoWebappPlatform.TangoDeviceAlias.create_many_as_existing(aliases.map(function(it){
                        return {value: it};
                    }));
                    this.aliases.parse(aliases);
                    return aliases;
                }.bind(this))
        }
    }
);

//TODO move to separate file: compatibility
if (window['TangoHost'] === undefined)
    TangoHost = TangoWebappPlatform.TangoHost;
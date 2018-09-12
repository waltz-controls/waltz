/**
 * Model tango_host
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @class
 * @memberof tango
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
    /** @lends  tango.TangoHost */
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
    /** @lends  tango.TangoHost.prototype */
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
            MVC.Object.extend(attrs, {
                aliases: new webix.DataCollection(),
                domains: new webix.DataCollection(),
                families: new webix.DataCollection(),
                members: new webix.DataCollection()
            });

            this._super(attrs);


        },
        /**
         * @return {string} device
         */
        toUrl: function () {
            return this.host + "/" + this.port;
        },
        /**
         *
         * @event tango_webapp.device_loaded
         * @type {OpenAjax}
         * @property {TangoDevice} data
         * @memberof TangoWebappPlatform
         */
        /**
         *
         * Fires event to OpenAjax: tango_webapp.device_loaded
         * @fires tango_webapp.device_loaded
         *
         * @param name
         * @return {Promise<TangoDevice>} device
         */
        fetchDevice: function (name) {
            var device;
            if((device = TangoWebappPlatform.TangoDevice.find_one(this.id + "/" + name)) !== null) return webix.promise.resolve(device);
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
         * @event tango_webapp.tango_host_loaded
         * @type {OpenAjax}
         * @property {TangoHost} data
         * @memberof TangoWebappPlatform
         */
        /**
         *
         * @event tango_webapp.database_loaded
         * @type {OpenAjax}
         * @property {TangoDatabase} data
         * @memberof TangoWebappPlatform
         */
        /**
         * Fires event to OpenAjax
         * @fires tango_webapp.tango_host_loaded
         * @fires tango_webapp.device_loaded
         * @fires tango_webapp.database_loaded
         * @return {Promise<TangoDatabase>} database
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
                    var tango_host = this;
                    var aliases = TangoWebappPlatform.TangoDeviceAlias.create_many_as_existing(aliases.map(function(it){
                        return {
                            value: it,
                            host: tango_host
                        };
                    }));
                    this.aliases.parse(aliases);
                    return aliases;
                }.bind(this))
        },
        /**
         *
         * @param filter
         * @return {Promise<TangoDomain>}
         */
        fetchDomains:function(filter){
            return this.fetchDatabase()
                .then(function(db){
                    return db.getDeviceDomainList(filter || '*');
                })
                .then(function(domains){
                    var tango_host = this;
                    var domains = TangoWebappPlatform.TangoDomain.create_many_as_existing(domains.output.map(function(it){
                        return {
                            value: it,
                            host: tango_host
                        }
                    }));

                    this.domains.parse(domains);
                    return domains;
                }.bind(this))
        },
        /**
         *
         * @param filter
         * @return {Promise<TangoFamily>}
         */
        fetchFamilies:function(filter){
            return this.fetchDatabase()
                .then(function(db){
                    return db.getDeviceFamilyList(filter);
                }.bind(this))
                .then(function(families){
                    var tango_host = this.host;
                    var tango_domain = this;
                    var families = TangoWebappPlatform.TangoFamily.create_many_as_existing(families.output.map(function(it){
                        return {
                            value: it,
                            host: tango_host,
                            domain: tango_domain
                        }
                    }));

                    this.families.parse(families);
                    return families;
                }.bind(this))
        },
        /**
         *
         * @param filter
         * @return {Promise<TangoMember>}
         */
        fetchMembers:function(filter){
            return this.fetchDatabase()
                .then(function(db){
                    return db.getDeviceMemberList(filter);
                }.bind(this))
                .then(function(members){
                    var tango_host = this.host;
                    var tango_family = this;
                    var members = TangoWebappPlatform.TangoMember.create_many_as_existing(members.output.map(function(it){
                        return {
                            value: it,
                            host: tango_host,
                            family: tango_family
                        }
                    }));

                    this.members.parse(members);
                    return members;
                }.bind(this))
        },
        /**
         *
         * @return {string}
         */
        getIcon:function(){
           return 'fa-database' ;
        }
    }
);

//TODO move to separate file: compatibility
if (window['TangoHost'] === undefined)
    TangoHost = TangoWebappPlatform.TangoHost;
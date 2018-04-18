/**
 * Model user_context
 *
 * Contains associated with this user data e.g. rest_url, tango_hosts, device filters
 *
 * @type {UserContext}
 */
TangoWebappPlatform.UserContext = MVC.Model.extend('user_context',
    /* @Static */
    {
        store_type: TangoWebappStorage,
        id: "user",
        attributes: {
            user: 'string',
            rest_url: 'string',
            tango_hosts: '{}',
            device_filters: 'string[]',
            ext:'object'
        },
        default_attributes: {
            rest_url: TangoWebappPlatform.consts.REST_API_PROTOCOL + '://' + TangoWebappPlatform.consts.REST_API_HOST + ':' + TangoWebappPlatform.consts.REST_API_PORT
        },
        /**
         * WARNING!!! Due to limitations of TangoWebapp storage this method always returns new instance
         *
         * @param id
         *
         * @returns {UserContext} found or newly created with default values
         */
        find_one: function (id) {
            var result = this._super(id);
            if (result == null) {
                var default_tango_host = {};
                default_tango_host[TangoWebappPlatform.consts.TANGO_HOST + ':' + TangoWebappPlatform.consts.TANGO_PORT] = '';

                result = this.create_as_existing({
                    user: id,
                    tango_hosts: default_tango_host,
                    device_filters: ['*/*/*'],
                    ext: Object.create(null)
                });
            }
            return result;
        },
        /**
         *
         *
         * @param store
         */
        set_store_type:function(store){
            this.store_type = store;
            this.store = new store(this);
        }
    },
    /* @Prototype */
    {
        /**
         *
         * @param attrs
         *
         * @constructor
         */
        init: function (attrs) {
            this._super(attrs);
            //we have to override stored instance because this._super writes it with default values
            //this happens because WebappStorage has to create new instance everytime it is being updated
            //therefore wrong values are being persisted
            this.save();
            //global instance
        },
        /**
         * Stores this instance in localStorage
         *
         * Sets this.Class.current to null
         *
         */
        destroy: function () {
            this.save();
            this.Class.store.destroy(this[this.Class.id]);
            this.publish("destroy", {data:this});
        },
        toDeviceFilter: function () {
            return new DeviceFilter({
                user: this.user,
                value: this.device_filters
            });
        },
        toString: function () {
            var tango_hosts = [];

            for (var tango_host in this.tango_hosts) {
                if (!this.tango_hosts.hasOwnProperty(tango_host)) continue;
                tango_hosts.push(tango_host);
            }

            return ["UserContext[",
                "user=", this.user,
                ";rest_url=", this.rest_url,
                ";tango_hosts=", tango_hosts.join(),
                ";device_filters=", this.device_filters.join(), "]"].join('\n');
        }
    }
);

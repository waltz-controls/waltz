/**
 * Model user_context
 *
 * Contains associated with this user data e.g. rest_url, tango_hosts, device filters
 *
 * @type {UserContext}
 */
TangoWebapp.platform.UserContext = MVC.Model.extend('user_context',
    /* @Static */
    {
        store_type: TangoRemoteStorage,
        id: "user",
        attributes: {
            user: 'string',
            rest_url: 'string',
            tango_hosts: '{}',
            device_filters: 'string[]' //TODO move to application layer?
        },
        default_attributes: {
            rest_url: TangoWebapp.consts.REST_API_PROTOCOL + '://' + TangoWebapp.consts.REST_API_HOST + ':' + TangoWebapp.consts.REST_API_PORT
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
                default_tango_host[TangoWebapp.consts.TANGO_HOST + ':' + TangoWebapp.consts.TANGO_PORT] = '';

                result = new this({
                    user: id,
                    tango_hosts: default_tango_host,
                    device_filters: ['*/*/*']
                });
            }
            return result;
        },
        /**
         *
         * @param id
         * @param attrs
         *
         * @override model.js#update
         */
        update: function (id, attrs) {
            this.store.update(id, attrs);
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
            this.Class.store.destroy(this[this.Class.id]);
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
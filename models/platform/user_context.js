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
        store_type: TangoWebappStorage,
        id: "user",
        attributes: {
            user: 'string',
            rest_url: 'string',
            tango_hosts: '{}',
            device_filters: 'string[]' //TODO move to application layer?
        },
        default_attributes: {
            rest_url: 'http://localhost:10001'
        },
        /**
         * WARNING!!! Due to limitations of TangoWebapp storage this method always returns new instance
         *
         * @param id
         *
         * @event {OpenAjax} user_context.create
         * @returns {UserContext} found or newly created with default values
         */
        find_one: function (id) {
            var result = this._super(id);
            if (result == null) {
                result = new this({
                    user: id,
                    tango_hosts: {
                        'localhost:10000': ''
                    },
                    device_filters: ['*/*/*']
                });
            }
            UserContext = result;
            this.publish('create', {data: result});
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
         * @event {OpenAjax} user_context.destroy
         */
        destroy: function () {
            this.save();
            UserContext = null;
            this.publish("destroy", {data: this});
        },
        /**
         *
         * @param attrs
         *
         * @event {OpenAjax} user_context.update
         */
        update_attributes: function (attrs) {
            this._super(attrs);
            this.publish("update", {data: this});
        },
        /**
         * Does nothing if tango_host is already exist
         *
         * @param {string} tango_host
         *
         * @event {OpenAjax} user_context.add_tango_host
         */
        add_tango_host: function (tango_host) {
            if (this.tango_hosts.hasOwnProperty(tango_host)) return;
            this.tango_hosts[tango_host] = "";
            this.save();
            this.publish("add_tango_host", {
                context: this,
                data: tango_host
            })
        },
        /**
         * Does nothing if tango_host is already deleted
         *
         * @param tango_host
         *
         * @event {OpenAjax} user_context.delete_tango_host
         */
        delete_tango_host: function (tango_host) {
            if (!this.tango_hosts.hasOwnProperty(tango_host)) return;
            delete this.tango_hosts[tango_host];
            this.save();
            this.publish("delete_tango_host", {
                context: this,
                data: tango_host
            })
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
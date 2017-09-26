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
         * @event {OpenAjax} user_context.init
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
         * @event {OpenAjax} user_context.init
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
            UserContext = this;
            this.publish("init", {data: this});
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
         *
         * @param {string} tango_host
         *
         * @event {OpenAjax} user_context.add_tango_host
         */
        add_tango_host: function (tango_host) {
            this.tango_hosts[tango_host] = "";
            this.save();
            this.publish("add_tango_host", {
                context: this,
                data: tango_host
            })
        },
        /**
         *
         * @param tango_host
         *
         * @event {OpenAjax} user_context.delete_tango_host
         */
        delete_tango_host: function (tango_host) {
            delete this.tango_hosts[tango_host];
            this.save();
            this.publish("delete_tango_host", {
                context: this,
                data: tango_host
            })
        }
    }
);
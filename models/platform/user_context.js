/**
 * Model user_context
 *
 * Contains associated with this user data e.g. rest_url, tango_hosts, device filters
 *
 * @type {UserContext}
 */
TangoWebapp.UserContext = MVC.Model.extend('user_context',
    /* @Static */
    {
        //global instance
        current: null,
        store_type: TangoWebappStorage,
        id: "user",
        attributes: {
            user: 'string',
            rest_url: 'string',
            tango_hosts: 'string[]',
            device_filters: 'string[]' //TODO move to application layer?
        },
        default_attributes: {
            rest_url: 'http://localhost:10001',
            tango_hosts: ['localhost:10000'],
            device_filters: ['*/*/*']
        },
        /**
         * WARNING!!! Due to limitations of TangoWebapp storage this method always returns new instance
         *
         * @param id
         *
         * @event {OpenAjax} tango_webapp.user_context_loaded
         * @returns {UserContext} loaded or newly created with default values
         */
        find_one: function (id) {
            var result = this._super(id);
            if (result == null) {
                result = new TangoWebapp.UserContext({
                    user: id
                });
            }
            this.current = result;
            OpenAjax.hub.publish("tango_webapp.user_context_loaded", {data: result});
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
         * @constructor
         */
        init: function (attrs) {
            this._super(attrs);
            //we have to override stored instance because this._super writes it with default values
            //this happens because WebappStorage has to create new instance everytime it is being updated
            //therefore wrong values are being persisted
            this.Class.store.update(this[this.Class.id], this.attributes());
        },
        /**
         * Stores this instance in localStorage
         *
         * Sets this.Class.current to null
         *
         * @event {OpenAjax} tango_webapp.user_context.destroy
         */
        destroy: function () {
            this.Class.store.update(this[this.Class.id], this.attributes());
            this.Class.current = null;
            OpenAjax.hub.publish("tango_webapp.user_context.destroy", {data: this});
        },
        /**
         *
         * @param attrs
         *
         * @event {OpenAjax} tango_webapp.user_context.update
         */
        update_attributes: function (attrs) {
            this._super(attrs);
            OpenAjax.hub.publish("tango_webapp.user_context.update", {data: this});
        }
    }
);

if (window['UserContext'] === undefined)
    UserContext = TangoWebapp.UserContext;
/**
 * Model user_context
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
            device_filters: 'string[]'
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
        }
    },
    /* @Prototype */
    {
        rest: null,
        /**
         *
         * @param {TangoRestApi} v - newRestApi
         *
         * @event {OpenAjax} tango_webapp.rest_api_changed
         */
        set_rest: function (v) {
            this.rest_url = v.url;
            this.rest = v;
            OpenAjax.hub.publish("tango_webapp.user_context.rest_api_changed", {data: v});
        },
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
            this.Class.store.create(this);
            //TODO deal with this side effect
            var rest = TangoWebapp.TangoRestApi.find_one(this.rest_url);
            if (rest == null) rest = new TangoWebapp.TangoRestApi({url: this.rest_url});
            this.rest = rest;
        },
        /**
         * Updates this instance (stores attributes in localStorage)
         *
         * @event {OpenAjax} tango_webapp.user_context.update
         */
        update: function () {
            this.Class.store.create(this);
            OpenAjax.hub.publish("tango_webapp.user_context.update", {data: this});
        },
        /**
         * Stores this instance in localStorage
         *
         * Sets this.Class.current to null
         *
         * @event {OpenAjax} tango_webapp.user_context.destroy
         */
        destroy: function () {
            this.Class.store.create(this);
            this.Class.current = null;
            OpenAjax.hub.publish("tango_webapp.user_context.destroy", {data: this});
        }
    }
);

if (window['UserContext'] === undefined)
    UserContext = TangoWebapp.UserContext;
/**
 * Model user_context
 *
 * @type {UserContext}
 */
TangoWebapp.UserContext = MVC.Model.extend('user_context',
    /* @Static */
    {
        //global instance
        instance: null,
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
            this.instance = result;
            OpenAjax.hub.publish("tango_webapp.user_context_loaded", {data: result});
            return result;
        }
    },
    /* @Prototype */
    {
        rest: null,
        destroy: function () {
            this.Class.instance = null;
        }
    }
);

if (window['UserContext'] === undefined)
    UserContext = TangoWebapp.UserContext;
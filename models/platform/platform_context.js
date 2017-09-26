/**
 * Model application_context
 *
 * @type {PlatformContext}
 */
TangoWebapp.platform.PlatformContext = MVC.Model.extend('platform_context',
    /* @Static */
    {
        attributes: {
            id: 'string'
        },
        default_attributes: {
            id: 'singleton'
        }
    },
    /* @Prototype */
    {
        user_context: null,
        rest: null,
        tango_hosts: null,
        devices: null,
        /**
         *
         * @param {UserContext} v
         *
         * @event {OpenAjax} platform_context.set_user_context
         */
        set_user_context: function (v) {
            this.user_context = v;
            this.publish("set_user_context", {data: this});
        },
        /**
         *
         * @param {TangoRestApi} v - new rest api
         *
         * @event {OpenAjax} platform_context.set_rest
         */
        set_rest: function (v) {
            this.rest = v;
            this.user_context.update_attributes({
                rest_url: v.url
            });

            TangoWebappHelpers.iterate(this.tango_hosts, function (it) {
                it.rest = rest;
            });

            this.publish("set_rest", {data: this});
        },
        //TODO jmvc attributes clashes with tango attributes
        //attributes: null,
        /**
         *
         * @param attrs
         * @constructor
         *
         * @event {OpenAjax} platform_context.init
         */
        init: function (attrs) {
            this.tango_hosts = new webix.DataCollection();
            this.devices = new webix.DataCollection();

            this._super(attrs);//calls set_rest

            PlatformContext = this;

            var user_context = this.user_context;
            var rest = this.rest;

            var tango_hosts = [];
            for (var tango_host in user_context.tango_hosts) {
                if (!user_context.tango_hosts.hasOwnProperty(tango_host)) continue;

                tango_hosts.push(tango_host);
            }

            rest.promise.all(tango_hosts.map(function (it) {
                return rest.fetchHost.apply(rest, it.split(':'))
            })).then(function (resp) {
                this.tango_hosts.parse(resp);

                this.publish("init", {data: this});
            }.bind(this));
        },
        /**
         * Destroys this instance
         *
         * @event {OpenAjax} platform_context.destroy
         */
        destroy: function () {
            this._super();
            this.user_context.destroy();
            //TODO clear all data
            PlatformContext = null;
        }
    }
);
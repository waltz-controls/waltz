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
            this._super(attrs);
            this.tango_hosts = new webix.DataCollection();
            this.devices = new webix.DataCollection();

            PlatformContext = this;
            this.publish("init", {data: this});
        },
        /**
         *
         * @param {TangoDevice} device
         *
         * @event {OpenAjax} platform_context.add_device
         */
        add_device: function (device) {
            //TODO protect from not unique id
            this.devices.add(device);
            this.publish("add_device", {
                new_device: device,
                data: this
            });
        },
        /**
         *
         * @param {TangoHost} tango_host
         *
         * @evemt {OpenAjax} platform_context.add_tango_host
         */
        add_tango_host: function (tango_host) {
            //TODO protect from not unique id
            this.tango_hosts.add(tango_host);
            this.publish("add_tango_host", {
                new_tango_host: tango_host,
                data: this
            });
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
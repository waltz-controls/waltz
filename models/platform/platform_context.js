/**
 * Model application_context
 *
 * @type {PlatformContext}
 */
TangoWebapp.platform.PlatformContext = MVC.Model.extend('platform_context',
    /* @Static */
    {
        current: null,
        attributes: {
            id: 'string'
        },
        default_attributes: {
            id: 'singleton'
        }
    },
    /* @Prototype */
    {
        rest: null,
        tango_hosts: null,
        devices: null,
        /**
         *
         * @param {TangoRestApi} v - new rest api
         *
         * @event {OpenAjax} tango_webapp.platform_context.set_rest
         */
        set_rest: function (v) {
            this.rest = v;
            OpenAjax.hub.publish("tango_webapp.platform_context.set_rest", {data: this});
        },
        //TODO jmvc attributes clashes with tango attributes
        //attributes: null,
        /**
         *
         * @param attrs
         * @constructor
         */
        init: function (attrs) {
            this._super(attrs);
            this.tango_hosts = new webix.DataCollection();
            this.devices = new webix.DataCollection();

            this.Class.current = this;
            OpenAjax.hub.publish("tango_webapp.platform_context.init", {data: this});
        },
        /**
         *
         * @param {TangoDevice} device
         *
         * @event {OpenAjax} tango_webapp.platform_context.add_device
         */
        add_device: function (device) {
            //TODO protect from not unique id
            this.devices.add(device);
            OpenAjax.hub.publish("tango_webapp.platform_context.add_device", {data: this});
        },
        /**
         *
         * @param {TangoHost} tango_host
         *
         * @evemt {OpenAjax} tango_webapp.platform_context.add_tango_host
         */
        add_tango_host: function (tango_host) {
            //TODO protect from not unique id
            this.tango_hosts.add(tango_host);
            OpenAjax.hub.publish("tango_webapp.platform_context.add_tango_host", {data: this});
        },
        /**
         * Destroys this instance
         */
        destroy: function () {
            this._super();
            this.Class.current = null;
            OpenAjax.hub.publish("tango_webapp.platform_context.destroy", {data: this});
        }

    }
);

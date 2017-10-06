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
        },
        /**
         *
         * @param {Object} attrs - must have rest:TangoRestApi and user_context:UserContext
         */
        create: function (attrs) {
            //TODO make this return value
            PlatformContext = this.create_as_existing(attrs);

            var user_context = PlatformContext.user_context;

            var tango_hosts = [];
            for (var tango_host in user_context.tango_hosts) {
                if (!user_context.tango_hosts.hasOwnProperty(tango_host)) continue;

                tango_hosts.push(tango_host);
            }


            var rest = PlatformContext.rest;


            var fetched_hosts = tango_hosts.map(function (it) {
                return rest.fetchHost(it)
            });

            rest.promise.all(
                tango_hosts.map(function (it) {
                    return rest.fetchHost(it)
                        .fail(function (failed_host) {
                            TangoWebappHelpers.error("Failed to load Tango host " + failed_host.id);
                            return failed_host;//prevent promise.all from failing
                        })
                })
            ).then(PlatformContext.tango_hosts.parse.bind(PlatformContext.tango_hosts)
            ).then(this.publish.bind(this, "create", {data: PlatformContext}));
        }
    },
    /* @Prototype */
    {
        //TODO association
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
                it.rest = v;
            });

            this.publish("set_rest", {data: this});
        },
        //TODO jmvc attributes clashes with tango attributes
        //attributes: null,
        /**
         *
         * @param attrs
         * @constructor
         */
        init: function (attrs) {
            this.tango_hosts = new webix.DataCollection({
                defaultData: TangoHost.default_attributes
            });
            this.devices = new webix.DataCollection({
                defaultData: webix.extend(TangoDevice.default_attributes, {
                    attrs: new webix.DataCollection(),
                    commands: new webix.DataCollection(),
                    pipes: new webix.DataCollection()
                })
            });

            this._super(attrs);//calls set_rest
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
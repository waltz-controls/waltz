/**
 * Model application_context
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @namespace {TangoWebappPlatform}
 * @property {string} id
 * @property {UserContext} UserContext
 */
TangoWebappPlatform.PlatformContext = MVC.Model.extend('platform_context',
    /** @lends  TangoWebappPlatform.PlatformContext */
    {
        attributes: {
            id: 'string',
            UserContext: '{}'
        },
        default_attributes: {
            id: 'singleton'
        },
        /**
         * @param {Object} attrs - must have rest:TangoRestApi and user_context:UserContext
         * @fires platform_context.create
         */
        create: function (attrs) {
            //TODO make this return value
            PlatformContext = this.create_as_existing(attrs);

            var user_context = PlatformContext.UserContext;

            var tango_hosts = [];
            for (var tango_host in user_context.tango_hosts) {
                if (!user_context.tango_hosts.hasOwnProperty(tango_host)) continue;

                tango_hosts.push(tango_host);
            }


            var rest = PlatformContext.rest;


            rest.promise.all(
                tango_hosts.map(function (it) {
                    return rest.fetchHost(it)
                        .fail(function (failed_host) {
                            TangoWebappHelpers.error("Failed to load Tango host " + failed_host.id);
                            return failed_host;//prevent promise.all from failing
                        })
                })
            ).then(PlatformContext.tango_hosts.parse.bind(PlatformContext.tango_hosts)
            ).then(this.publish.bind(this, "create", {data: PlatformContext})
            ).fail(function(err){
                TangoWebappHelpers.error("Failed to create PlatformContext! See console...", err);
                debugger
            });
        }
    },
    /** @lends  TangoWebappPlatform.PlatformContext.prototype */
    {
        //TODO association
        /** @member {UserContext} */
        UserContext: null,
        /** @member {rest} */
        rest: null,
        /** @member {tango_hosts} */
        tango_hosts: null,
        /** @member {devices} */
        devices: null,
        /**
         *
         * @event platform_context.set_user_context
         * @type {OpenAjax}
         * @property {PlatformContext} data
         * @memberof TangoWebappPlatform
         */
        /**
         * Fires event to OpenAjax: platform_context.set_user_context
         *
         * @fires platform_context.set_user_context
         * @param {UserContext} v
         */
        set_UserContext: function (v) {
            this.UserContext = v;
            this.publish("set_user_context", {data: this});
        },
        /**
         *
         * @event platform_context.set_rest
         * @type {OpenAjax}
         * @property {PlatformContext} data
         * @memberof TangoWebappPlatform
         */
        /**
         * Fires event to OpenAjax: platform_context.set_rest
         * @param {TangoRestApi} v - new rest api
         * @fires platform_context.set_rest
         */
        set_rest: function (v) {
            this.rest = v;
            this.UserContext.update_attributes({
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
         * @param attrs
         * @constructs
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
         *
         * @event platform_context.destroy
         * @type {OpenAjax}
         * @property {PlatformContext} data
         * @memberof TangoWebappPlatform
         */
        /**
         * Saves UserContext then destroys this instance
         *
         * Fires event to OpenAjax: platform_context.destroy
         *
         * @fires platform_context.destroy
         */
        destroy: function () {
            this._super();
            this.UserContext.save();
            //TODO clear all data
            PlatformContext = null;
        }
    }
);

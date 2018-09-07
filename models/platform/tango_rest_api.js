
/**
 * Model tango_rest_api
 * @name {TangoRestApi}
 * @property {string} url
 * @extends MVC.Model
 */
TangoWebappPlatform.TangoRestApi = MVC.Model.extend('tango_rest_api',
    /** @lends  TangoWebappPlatform.TangoRestApi */
    {
        _api_version: 'rc4',
        id: "url",
        attributes: {
            url: 'string'
        },
        default_attributes: {}
    },
    /** @lends  TangoWebappPlatform.TangoRestApi.prototype */
    {
        /** @member {promise} */
        promise: null,
        /** @member {req_ids} */
        req_ids: null,
        /**
         *
         * @constructs
         * @param params
         */
        init: function (params) {
            if (!params.url) throw "Bad argument: url is expected here";
            this._super(params);
            this.req_ids = [];
            this.promise = webix.promise;
        },
        /**
         *
         * @returns {TangoRestApiRequest}
         */
        request: function () {
            var request = new TangoWebappPlatform.TangoRestApiRequest({url: this.url + "/tango/rest/" + this.Class._api_version});
            this.req_ids.push(request.id);//TODO or should we store actual ref here
            return request;
        },
        /**
         * Fires event to OpenAjax
         * @param {string} host - host
         * @param {int} port - port
         * @event {OpenAjax} tango_webapp.rest_api.fetch_host
         * @return {Promise}
         */
        fetchHost: function (host) {
            return this.request().hosts(host.replace(':', '/')).get()
                .then(function (resp) {
                        var newHost = new TangoWebappPlatform.TangoHost(MVC.Object.extend(resp, {
                            id: host,
                            rest: this,
                            is_alive: true
                        }));
                        OpenAjax.hub.publish("tango_webapp.tango_host_loaded", {data: newHost});
                        return newHost;
                    }.bind(this)
                ).fail(function (resp) {
                    var newHost = new TangoWebappPlatform.TangoHost({
                        id: host,
                        errors: resp.errors,
                        rest: this,
                        is_alive: false
                    });
                    OpenAjax.hub.publish("tango_webapp.tango_host_loaded", {data: newHost});
                    throw newHost;
                }.bind(this));
        },
        /**
         * Fires event to OpenAjax
         * @event {OpenAjax} tango_rest_api.is_alive
         * @event {OpenAjax} tango_rest_api.is_not_alive
         * @return {Promise}
         */
        isAlive: function () {
            var request = this.request();
            return request.get()
                .then(function () {
                    this.publish("is_alive", {data: this});
                    return this;
                    }.bind(this)
                ).fail(
                    function () {
                        this.publish("is_not_alive", {data: this});
                        throw this;
                    }.bind(this)
                );
        }
    }
);

if (window['TangoRestApi'] === undefined)
    TangoRestApi = TangoWebappPlatform.TangoRestApi;
/**
 * Model tango_rest_api
 *
 * @type {TangoRestApi}
 */
TangoWebapp.TangoRestApi = MVC.Model.extend('tango_rest_api',
    /* @Static */
    {
        _api_version: 'rc4',
        id: "url",
        attributes: {
            url: 'string'
        },
        default_attributes: {}
    },
    /* @Prototype */
    {
        promise: null,
        req_ids: null,
        /**
         *
         * @constructor
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
            var request = new TangoWebapp.TangoRestApiRequest({url: this.url + "/tango/rest/" + this.Class._api_version});
            this.req_ids.push(request.id);//TODO or should we store actual ref here
            return request;
        },
        /**
         *
         * @param {string} host - host
         * @param {int} port - port
         *
         * @event {OpenAjax} tango_webapp.host_loaded
         * @return {Promise}
         */
        fetchHost: function (host, port) {
            return this.request().hosts(host + "/" + port).get()
                .then(function (resp) {
                        var newHost = new TangoWebapp.TangoHost(MVC.Object.extend(resp, {
                            id: host + ":" + port,
                            rest: this
                        }));
                        OpenAjax.hub.publish("tango_webapp.host_loaded", {data: newHost});
                        return newHost;
                    }.bind(this)
                );
        },
        /**
         *
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
    TangoRestApi = TangoWebapp.TangoRestApi;
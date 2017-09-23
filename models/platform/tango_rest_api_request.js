/**
 * Model tango_rest_api
 *
 * @type {TangoRestApiRequest}
 */
TangoWebapp.TangoRestApiRequest = MVC.Model.extend('tango_rest_api_request',
    /* @Static */
    {
        _id: 1,
        attributes: {
            id: 'number',
            url: 'string',
            //TODO set in terminal operations and reuse
            result: 'object'
        },
        default_attributes: {}
    },
    /* @Prototype */
    {
        transport: webix.ajax,
        init: function (params) {
            this._super(MVC.Object.extend(params, {id: this.Class._id++}));
        },
        /**
         *
         * @param resp
         * @returns {*}
         * @private
         */
        _success: function (resp) {
            var json = {};
            if (resp.text().length > 0) {
                json = resp.json();

                if (json.quality === 'FAILURE') {
                    OpenAjax.hub.publish("tango_webapp.rest_failure", {data: json});
                    throw json;
                }
            }
            OpenAjax.hub.publish("tango_webapp.rest_success", {data: json});
            return json;
        },

        _failure: function (resp) {
            var json;
            try {
                json = JSON.parse(resp.responseText);
            } catch (e) {
                console.log(e);
                json = {
                    errors: [
                        {
                            reason: resp.status,
                            description: resp.responseText,
                            severity: 'ERR',
                            origin: this.url
                        }
                    ],
                    quality: 'FAILURE',
                    timestamp: +new Date()
                }
            }
            OpenAjax.hub.publish("tango_webapp.rest_failure", {data: json});
            throw json;
            //TODO move to platform.ui.controller
            // if (resp.errors && resp.errors.length > 0) //tango rest specific
            //     for (var i = 0, size = resp.errors.length; i < size; ++i) {
            //         TangoWebapp.error(resp.errors[i].reason + ": " + resp.errors[i].description);
            //     }
            // else { //general failure
            //     console.error("Unexpected error");
            //     throw resp;
            // }
        },
        /**
         *
         * @returns {TangoRestApiRequest}
         */
        hosts: function (host) {
            this.url += '/hosts/';
            this.url += host;
            return this;
        },

        /**
         * @returns {TangoRestApiRequest}
         */
        devices: function (name) {
            this.url += '/devices/';
            this.url += name;
            return this;
        },

        /**
         * @returns {TangoRestApiRequest}
         */
        properties: function () {
            this.url += '/properties';
            return this;
        },

        /**
         * @returns {TangoRestApiRequest}
         */
        pipes: function (name) {
            this.url += '/pipes/';
            if (name) this.url += name;
            return this;
        },

        /**
         *
         * @param name
         * @returns {TangoRestApiRequest}
         */
        commands: function (name) {
            //TODO check devices branch
            this.url += '/commands/';
            if (name) this.url += name;
            return this;
        },

        /**
         *
         * @param name
         * @returns {TangoRestApiRequest}
         */
        attributes: function (name) {
            //TODO check devices branch
            this.url += '/attributes/';
            if (name) this.url += name;
            return this;
        },

        /**
         *
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {Promise}
         */
        exec: function (argin) {
            return this.put("", argin);
        },


        /**
         *
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {Promise}
         */
        get: function (what) {
            //TODO save stack trace
            if (what) this.url += what;
            return this.transport().get(this.url).then(this._success.bind(this)).fail(this._failure.bind(this));
        },

        /**
         *
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {Promise}
         */
        put: function (what, data) {
            if (what) this.url += what;//TODO if no what is provided data will be treated as what -> failure
            return this.transport().headers({
                "Content-type": "application/json"
            }).put(this.url, (typeof data == 'object') ? JSON.stringify(data) : data).then(this._success.bind(this)).fail(this._failure.bind(this));
        },

        /**
         *
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {Promise}
         */
        "delete": function (what) {
            if (what) this.url += what;
            return this.transport().del(this.url).then(this._success.bind(this)).fail(this._failure.bind(this));
        }
    }
);

if (window['TangoRestApiRequest'] === undefined)
    TangoRestApiRequest = TangoWebapp.TangoRestApiRequest;
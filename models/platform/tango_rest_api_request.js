/**
* @namespace {TangoWebappPlatform}
* @extends MVC.Class
*/
TangoWebappPlatform.DummyStore = MVC.Class.extend(
    /** @lends  TangoWebappPlatform.DummyStore.prototype */
    {
        /**
         * @param {Object} id
         */
        find_one: function(id){
            return null;
        },
        /**
         * @param {Object} obj
         */
        create: function(obj){
        },
        /**
         * @param {Object} id
         */
        destroy: function(id){
        },
        /**
         * @param id
         * @param obj
         */
        update:function(id, obj){

        },
        /**
         * Finds instances using a test function.  If no test function is provided returns all instances.
         * @param {Function} f
         * @return {Array}
         */
        find : function(f){
            return [];
        },
        /**
         * Clears instances
         */
        clear : function(){
        },
        /**
         * Returns if there is no instances
         * @return {Boolean}
         */
        is_empty: function() {
            return true;
        }
    });

/**
 * Model tango_rest_api
 * @class [TangoRestApiRequest]
 * @property {number} id
 * @property {string} url
 * @property {string} type
 * @property {Object} result
 * @property {Object} failure
 * @extends MVC.Model
 */
TangoWebappPlatform.TangoRestApiRequest = MVC.Model.extend('tango_rest_api_request',
    /** @lends  TangoWebappPlatform.TangoRestApiRequest */
    {
        _id: 1,
        attributes: {
            id: 'number',
            url: 'string',
            type: 'string',
            result: 'object',
            failure: 'object'
        },
        default_attributes: {
            result: null,
            failure: null
        },
        /**
         * @constructs
         */
        init:function(){
            this._super();
            //do not store requests in production
            if(MVC.env() === 'production') {
                this.store_type = TangoWebappPlatform.DummyStore;
                this.store = new TangoWebappPlatform.DummyStore();
            }
        }
    },
    /** @lends  TangoWebappPlatform.TangoRestApiRequest.prototype */
    {
        //promise factory
        /** @member {promise} */
        promise: null,
        /** @member {transport} */
        transport: null,

        /**
         * @param attrs
         * @constructs
         */
        init: function (params) {
            this._super(MVC.Object.extend(params, {id: this.Class._id++}));
            this.transport = webix.ajax;
            this.promise = webix.promise;
        },
        /**
         * @param {} resp
         */
        add_errors:function(resp){
            resp.errors = resp.errors.map(function(error){ return TangoWebappHelpers.newTangoError(error)});
            this._super(resp.errors);
        },
        /**
         * @param resp
         * @returns {*}
         * @private
         */
        _success: function (resp) {
            var json = {};
            if (resp.text().length > 0) {
                json = resp.json();

                if (json.quality === 'FAILURE') {
                    this.add_errors(json);
                    this.failure = json;
                    OpenAjax.hub.publish("tango_webapp.rest_failure", {data: this});
                    throw json;
                }
            }
            this.result = json;
            OpenAjax.hub.publish("tango_webapp.rest_success", {data: this});
            return json;
        },

        /**
         * @param resp
         * @private
         */
        _failure: function (resp) {
            var json;
            try {
                json = JSON.parse(resp.responseText);
            } catch (e) {
                json = {
                    errors: [
                        {
                            reason: resp.status,
                            description: resp.responseText ? resp.responseText : "Unspecified error",
                            severity: 'ERR',
                            origin: this.url
                        }
                    ],
                    quality: 'FAILURE',
                    timestamp: +new Date()
                }
            }
            this.add_errors(json);
            this.failure = json;
            OpenAjax.hub.publish("tango_webapp.rest_failure", {data: this});
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
        properties: function (name) {
            this.url += '/properties/';
            if (name) this.url += name;
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
         * Fires event to OpenAjax
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {webix.promise}
         */
        exec: function (argin) {
            return this.put("", argin);
        },


        /**
         * Fires event to OpenAjax
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {webix.promise}
         */
        get: function (what) {
            if (this.result != null) return this.promise.resolve(this.result);
            if (this.failure != null) return this.promise.reject(this.failure);
            if (what) this.url += what;
            this.type = "GET";
            OpenAjax.hub.publish("tango_webapp.rest_send", {data: this});
            return this.transport().get(this.url).then(this._success.bind(this)).fail(this._failure.bind(this));
        },

        /**
         * Fires event to OpenAjax
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {webix.promise}
         */
        put: function (what, data) {
            if (this.result != null) return this.promise.resolve(this.result);
            if (this.failure != null) return this.promise.reject(this.failure);
            if (what) this.url += what;//TODO if no what is provided data will be treated as what -> failure
            this.type = "PUT";
            OpenAjax.hub.publish("tango_webapp.rest_send", {data: this});
            return this.transport().headers({
                "Content-type": "application/json"
            }).put(this.url, (typeof data == 'object') ? JSON.stringify(data) : data).then(this._success.bind(this)).fail(this._failure.bind(this));
        },

        /**
         * Fires event to OpenAjax
         * @event {OpenAjax} tango_webapp.rest_success
         * @event {OpenAjax} tango_webapp.rest_failure
         * @returns {webix.promise}
         */
        "delete": function (what) {
            if (this.result != null) return this.promise.resolve(this.result);
            if (this.failure != null) return this.promise.reject(this.failure);
            if (what) this.url += what;
            this.type = "DELETE";
            OpenAjax.hub.publish("tango_webapp.rest_send", {data: this});
            return this.transport().del(this.url).then(this._success.bind(this)).fail(this._failure.bind(this));
        }
    }
);

if (window['TangoRestApiRequest'] === undefined)
    TangoRestApiRequest = TangoWebappPlatform.TangoRestApiRequest;
/**
 * Model for connecting to resources with JSONP
 *
 * Since JSONP does not really have a way to distinguish between timeout (server is not available) and any exception on the server
 * side (Resource not found, unhandled ServletException etc) this model uses onComplete callback to decide between onSuccess and onFailure.
 * Therefore user must not define onComplete callback in the request
 *
 * It is expected that if server answers in a normal way then instances of this model will be created and user
 * may verify that there is no errors by checking corresponding field of this model. onFailure may be also
 * called if response contains an array of errors.
 *
 */
MVC.Model.JsonP = MVC.Model.extend(
    {
        _methods:{
            find_one:'get',
            find_all:'get',
            create:'post',
            update:'put',
            destroy:'delete'
        },
        /**
         * How long to wait before claiming "no response from server"
         */
        error_timeout: 3000,
        /**
         * Constructor for this model's Class
         *
         * @constructor
         */
        init: function () {
            if (!this.className) return;
            if (!this.domain) throw('a domain must be provided for remote model');
            if (!this.controller_name)
                this.controller_name = this.className;
            this.plural_controller_name = MVC.String.pluralize(this.controller_name);
            this._super();
        },
        /**
         * Looks for an instance of this model in {MVC.Store},
         * if not found -- requests server
         *
         * @param {*} id -- id to look up
         * @param {Object} params
         * @param {Object|Function} cbs -- callbacks
         * @return {MVC.Model}
         */
        find_one: function (id, params, cbs) {
            if(typeof params == 'function'){
                cbs = params;
                params = {};
            }
            var inst = this._super(id, params, cbs);

            if(inst) return inst;

            params[this.id] = id;
            this._send_request('find_one',params, cbs);
        },
        _default_onFailure:function(response){
            for(var i = 0, size = response.errors.length; i < size ;++i){
                console.error(response.errors[i]);
            }
        },
        /**
         * Wraps user defined onFailure
         *
         * @param error_callback
         * @private
         */
        _error_callback:function(error_callback){
            return function(response){
                error_callback(MVC.Object.extend(response,{errors:[response.responseText]}));
            }
        },
        /**
         * Request all instances of this model from the server.
         *
         * Instances all looked up at this.find_url or this.domain/this.plural_controller_name
         *
         * One can provide the following callbacks:
         * <ul>
         *     <li> onSuccess -- invoked in case of a successful response, i.e. received in time and without errors
         *     <li> onFailure -- invoked if response has errors. May not be provided -- in this case errors will be simply ignored
         * </ul>
         *
         * @param {Object} params
         * @param {Object} cbs
         */
        find_all: function (params, cbs) {
            params = params || {};

            this._send_request('find_all',params,cbs);
        },
        /**
         * Same as this._onComplete but always passes an array of this model instances
         *
         * @param {Object} clean_callbacks -- user callbacks passed through _clean_callbacks
         * @returns {Function}
         * @private
         */
        _find_all_onComplete:function(clean_callbacks){
            var me = this;
            return function (response) {
                if (response.errors)
                    clean_callbacks.onFailure(response);
                else
                    clean_callbacks.onSuccess(me.create_many_as_existing(response));
            };
        },
        _onComplete:function(clean_callbacks, action){
            var me = this;
            return function (response) {
                var inst = new me(response);
                me.publish(action,{data:inst});
                if (inst.valid())
                    clean_callbacks.onSuccess(inst);
                else
                    if(clean_callbacks.onFailure) clean_callbacks.onFailure(inst);

            };
        },
        /**
         * Creates a new instance of this model on the server.
         *
         * The instance is created at this.create_url or this.domain/this.plural_controller_name
         *
         * One can provide the following callbacks:
         * <ul>
         *     <li> onSuccess -- invoked in case of a successful response, i.e. received in time and without errors
         *     <li> onComplete -- invoked in both cases: success or failure
         *     <li> onFailure -- invoked if response has errors. May not be provided -- in this case errors will be simply ignored
         * </ul>
         *
         * @param {Object} params
         * @param {Object} cbs
         */
        create: function (params, cbs) {
            this._send_request('create', params, cbs);
        },
        /**
         * Updates an instance of this model on the server
         *
         * @param id
         * @param {Object} attributes
         * @param {Object} cbs
         */
        update: function (id, attributes, cbs) {
            var params = {};

            params[this.id] = id;
            MVC.Object.extend(params, attributes);

            this._send_request('update',params,cbs);
        },
        /**
         * Destroys an instance of this model on the server.
         *
         * Instance is destroyed at this.destroy_url or this.domain/this.plural_controller_name
         *
         * @param id
         * @param {Object} cbs
         */
        destroy: function (id, cbs) {
            var params = {};

            params[this.id] = id;

            this._send_request('delete',params,cbs);
        },
        _send_request:function(action, params, cbs){
            this._add_standard_params(params, action);

            var callbacks = this._clean_callbacks(cbs);
            if(!callbacks.onFailure) callbacks.onFailure = this._default_onFailure;
            var callback;
            if(action == 'find_all')
                callback = this._find_all_onComplete(callbacks);
            else if(action == 'create')
                callback = this._single_create_callback(callbacks);
            else
                callback = this._onComplete(callbacks,action);
            //in case of an error redefine response (add errors) then invoke onComplete
            var error_callback = this._error_callback(callback);

            var url = this[action + '_url'] ? this[action + '_url'] : this.domain + '/' + this.plural_controller_name;
            url += '?';

            var tll = this.top_level_length(params, url);
            var result = this._separate(params[this.controller_name], tll, this.controller_name);
            var postpone_params = result.postpone, send_params = result.send;

            if (result.send_in_parts) {
                //TODO test
                params[this.controller_name] = send_params;
                params['_mutlirequest'] = 'true';

                new MVC.JsonP(url, {
                    error_timeout: this.error_timeout,
                    callback_name: this.callback_name,
                    parameters: params,
                    onSuccess: MVC.Function.bind(this._parts_create_callback(params, callback, postpone_params), this),
                    onFailure: error_callback,
                    method: this._methods[action]
                });
            } else {
                params['_mutlirequest'] = null;

                new MVC.JsonP(url, {
                    error_timeout: this.error_timeout,
                    callback_name: this.callback_name,
                    parameters: params,
                    onSuccess: callback,
                    onFailure: error_callback,
                    method: this._methods[action]
                });
            }
        },
        _parts_create_callback: function (params, callback, postpone_params) {
            var me = this;
            return function (callback_params) {
                if (!callback_params.id) throw 'Your server must callback with the id of the object.  It is used for the next request';
                params[me.controller_name] = postpone_params;
                params.id = callback_params.id;
                me.create(params, callback);
            };
        },
        _single_create_callback: function (clean_callbacks) {
            var me = this;
            return function (response) {
                if (response.errors) {
                    var inst = new me(response[me.className] ? response[me.className] : {});
                    inst.add_errors(response.errors);
                    clean_callbacks.onFailure(inst);
                } else {
                    clean_callbacks.onSuccess(me.create_as_existing(response));
                }
            };
        },
        /**
         * //TODO redefine server error protocol
         *
         * Server always returns single object in case of error.
         *
         * This method works around this limitation.
         *
         * @param instances an array of raw objects from the server
         * @return {Array} an array of newly created objects
         */
        create_many_as_existing: function (instances) {
            if (!instances) return [];
            if (instances.errors) return [this.create_as_existing(instances)];

            return this._super(instances);
        },
        _add_standard_params: function (params, action) {
            if (!params.referer) params.referer = window.location.href;
            if (!params.action) params.action = action;
        },
        callback_name: 'cbk',
        domain: null,
        top_level_length: function (params, url) {
            var p = MVC.Object.extend({}, params);
            delete p[this.controller_name];
            return url.length + MVC.Object.to_query_string(p).length;

        },
        _separate: function (object, top_level_length, name) {
            var remainder = 2000 - 9 - top_level_length;
            var send = {};
            var postpone = {};
            var send_in_parts = false;
            for (var attr in object) {
                if (!object.hasOwnProperty(attr)) continue;
                var value = object[attr], value_length;
                var attr_length = encodeURIComponent(name + '[' + attr + ']').length;

                if (typeof value == 'string') {
                    value_length = encodeURIComponent(value).length;
                } else {
                    value_length = value.toString().length;
                }

                if (remainder - attr_length <= 30) {
                    postpone[attr] = value;
                    send_in_parts = true;
                    continue;
                }
                ;
                remainder = remainder - attr_length - 2; //2 is for = and &
                if (remainder > value_length) {
                    send[attr] = value;
                    remainder -= value_length;
                } else if (typeof value == 'string') {
                    var guess = remainder;
                    while (encodeURIComponent(value.substr(0, guess)).length > remainder) {
                        guess = parseInt(guess * 0.75) - 1;
                    }
                    send[attr] = value.substr(0, guess);
                    postpone[attr] = value.substr(guess);
                    send_in_parts = true;
                    remainder = 0;
                } else {
                    postpone[attr] = value;
                }
            }
            return {send: send, postpone: postpone, send_in_parts: send_in_parts};
        },
        random: parseInt(Math.random() * 1000000)
    },
//prototype functions
    {});


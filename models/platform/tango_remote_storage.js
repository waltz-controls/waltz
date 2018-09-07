/**
 * Model tango_remote_storage
 * @namespace {TangoWebappPlatform}
 * @memberof TangoWebappPlatform
 * @extends MVC.Class
 */
TangoRemoteStorage = MVC.Class.extend('tango_remote_storage',
    /** @lends  TangoWebappPlatform.TangoRemoteStorage */
    {
        url: TangoWebappPlatform.consts.USER_CONTEXT_URL
    },
    /** @lends  TangoWebappPlatform.TangoRemoteStorage.prototype */
    {
        /**
         * @private
         */
        _request_get:function(id){
            var response = (this.transport().sync().get(this.Class.url, { id : id }));
            var responseText = response.responseText.trim();
            if(response.status === 200)
                return responseText === "null" || responseText === "" ? null : responseText;
            else
                throw "Failed to load data from server"
        },
        /**
         * @param id
         * @param data
         * @private
         */
        _request_post:function(id, data){
            var response = (this.transport().sync().post(this.Class.url, { id : id, data: data }));
            var responseText = response.responseText.trim();
            if(response.status === 200)
                return responseText === "null" || responseText === "" ? null : responseText;
            else
                throw "Failed to load data from server"
        },
        /**
         * Nashorn conflict with webix workaround
         *
         * @return {webix.ajax}
         */
        transport: function () {
            if(!window['webix']) throw "webix is not defined";
            else
                return webix.ajax();
        },
        /**
         * @param klass
         * @constructs
         */
        init:function(klass){
            this.storing_class = klass;
        },
        /**
         * @param {String} id
         * @return {Object} JSON or null
         */
        find_one: function (id) {
            var responseText = this._request_get(id);
            return responseText == null ? null :
                JSON.parse(atob(responseText));
        },
        /**
         *
         */
        find:function(f){
            if(typeof f === 'function') throw new TypeError('TangoRemoteStorage does not support find by function!');
            return [this.find_one(f)];
        },
        /**
         * @param {Object} obj
         */
        create: function (obj) {
            var id = obj[obj.Class.id];
            this.update(id, obj.attributes());
        },
        /**
         * @param id
         * @param attrs
         * @return {*}
         */
        update: function (id, attrs) {
            return this._request_post(id, btoa(JSON.stringify(attrs)));
        },
        /**
         * @param {Object} id
         */
        destroy: function (id) {
            return this._request_post(id, null);
        },
        /**
         * Always false
         *
         * @return {Boolean} false
         */
        is_empty: function () {
            return false;
        }
    }
);
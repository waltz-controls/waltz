(function () {
    var TangoError = function(attrs){
        this.reason = attrs.reason;
        this.description = attrs.description;
        this.severity = attrs.severity;
        this.origin = attrs.origin;
    };

    TangoError.prototype.toString = function(){
        return ['<br/>Reason: ',this.reason,'<br/>',
                'Description: ', this.description,'<br/>',
                // 'Severity: ',this.severity,'\n',
                'Origin: ',this.origin
        ].join('');
    };

    /**
     *
     * @namespace helpers
     */
    TangoWebappPlatform.helpers = {
        /**
         *
         * @param {string} str
         * @returns {number}
         * @memberof helpers
         */
        strToHash: function (str) {
            var hash = 0, i, chr, len;
            if (str.length === 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },
        /**
         * @callback iterateCallback
         * @param  {webix.DataRecord} element
         * @param  {string} id
         */
        /**
         *
         * @param {webix.DataCollection} collection
         * @param {iterateCallback} f
         * @memberof helpers
         */
        iterate: function (collection, f) {
            var id = collection.getFirstId(),
                last = collection.getLastId();
            if (!id || !last) return;
            for (; id !== last; id = collection.getNextId(id)) {
                var item = collection.getItem(id);
                f(item, id);
            }
            f(collection.getItem(last), id)
        },

        //TODO move to log_controller; log messages must be broadcasted via OpenAjax.hub
        /**
         *
         * @param msg
         * @memberof helpers
         */
        log: function (msg) {
            console.log(msg);
            $$('main-log').log({type: '', value: msg, timestamp: +new Date()});
        },
        /**
         *
         * @param msg
         * @memberof helpers
         */
        logWithPopup: function (msg) {
            TangoWebappHelpers.log(msg);
            webix.message(msg);
        },

        /**
         *
         * @param msg
         * @param reason
         * @memberof helpers
         */
        error: function (msg, reason) {
            console.error(msg);
            if(reason) console.error(reason);
            //TODO process reason
            $$('main-log').log({
                type: 'error',
                value: msg.errors ? msg.errors.join('<hr/>') : msg,
                timestamp: +new Date()
            });
            webix.message({type: 'error', text: msg.errors ? 'An error has occurred! See log...' : msg});
            //TODO bind
            if($$('bottom-toolbar')) $$('bottom-toolbar').switchLogBtnIcon('error');
        },

        /**
         *
         * @param msg
         * @memberof helpers
         */
        debug: function (msg) {
            if (MVC.env() === 'development' || MVC.env() === 'test') {
                console.log(msg);
            }
        },

        /**
         *
         * @param attrs
         * @returns {TangoError}
         * @memberof helpers
         */
        newTangoError: function(attrs){
            return new TangoError(attrs);
        }
    };

    TangoWebappHelpers = TangoWebappPlatform.helpers;
})();
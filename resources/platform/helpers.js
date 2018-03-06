/**
 *
 * @type {{strToHash: TangoWebappPlatform.helpers.strToHash, iterate: TangoWebappPlatform.helpers.iterate, log: TangoWebappPlatform.helpers.log, error: TangoWebappPlatform.helpers.error, debug: TangoWebappPlatform.helpers.debug}}
 */
TangoWebappPlatform.helpers = {
    /**
     *
     * @param {string} str
     * @returns {number}
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
    /**
     *
     * @param msg
     */
    log: function (msg) {
        console.log(msg);
        webix.message(msg);
        $$('main-log').log({type: '', value: msg, timestamp: TangoWebapp.consts.LOG_DATE_FORMATTER(new Date())});
    },

    /**
     *
     * @param msg
     */
    //TODO process reason
    error: function (msg, reason) {
        console.error(msg);
        var id = $$('main-log').log({
            type: 'error',
            value: msg,
            timestamp: TangoWebapp.consts.LOG_DATE_FORMATTER(new Date())
        });
        webix.message({type: 'error', text: msg});
        $$('bottom-toolbar').switchLogBtnIcon('error');
        debugger
    },

    /**
     *
     * @param msg
     */
    debug: function (msg) {
        if (MVC.env() === 'development' || MVC.env() === 'test') {
            console.log(msg);
            var id = $$('main-log').log({
                type: '',
                value: msg,
                timestamp: TangoWebapp.consts.LOG_DATE_FORMATTER(new Date())
            });
        }
    }
};

TangoWebappHelpers = TangoWebappPlatform.helpers;
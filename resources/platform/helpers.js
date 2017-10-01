MVC.Object.extend(TangoWebapp.helpers, {
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
        webix.error({type: 'error', text: 'msg'});
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
});

TangoWebappHelpers = TangoWebapp.helpers;
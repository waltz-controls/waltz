/**
 *
 * @type {BottomToolbar}
 */
TangoWebapp.BottomToolbar = MVC.Controller.extend("bottom_toolbar_controller", {
    
}, {
    "tango_webapp.rest_send subscribe": function (data) {
        if(!$$('bottom-toolbar')) return;
        //TODO bind rest-url to log data
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "PENDING"));
    },
    "tango_webapp.rest_failure subscribe": function (data) {
        if(!$$('bottom-toolbar')) return;

        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "FAILED"));

        $$('main-log').log({
            type: 'error',
            value: data.data.errors,
            timestamp: +new Date()
        });
        $$('bottom-toolbar').switchLogBtnIcon('error');
    },
    "tango_webapp.rest_success subscribe": function (data) {
        if(!$$('bottom-toolbar')) return;
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "DONE"));
    },
    "platform.user_logout subscribe": function (event) {
        $$('main-log').clearAll();
    },
    _toMsg: function (req, msg) {
        return {
            type: req.type,
            url: req.url,
            msg: msg
        };
    }
});
/**
 *
 * @type {BottomToolbar}
 */
TangoWebapp.BottomToolbar = class extends MVC.Controller {
    static get className(){
        return "bottom_toolbar_controller"
    }
    "tango_webapp.rest_send subscribe"(data) {
        if(!$$('bottom-toolbar')) return;
        //TODO bind rest-url to log data
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "PENDING"));
    }
    "tango_webapp.rest_failure subscribe"(data) {
        if(!$$('bottom-toolbar')) return;

        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "FAILED"));

        $$('main-log').log({
            type: 'error',
            value: data.data.errors,
            timestamp: +new Date()
        });
        $$('bottom-toolbar').switchLogBtnIcon('error');
    }
    "tango_webapp.rest_success subscribe"(data) {
        if(!$$('bottom-toolbar')) return;
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "DONE"));
    }
    "platform.user_logout subscribe"(event) {
        $$('main-log').clearAll();
    }
    _toMsg(req, msg) {
        return {
            type: req.type,
            url: req.url,
            msg: msg
        };
    }
};

TangoWebapp.BottomToolbar.initialize();
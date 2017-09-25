MVC.Object.extend(TangoWebapp.mixin, {
    OpenAjaxListener: {
        _listener_controller: null,
        _listener_instance: null,
        $init: function (config) {
            this._listener_controller = MVC.Controller.extend(config.id, this, this.defaults.on);
            this._listener_instance = new this._listener_controller();
        }
    }
});
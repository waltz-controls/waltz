/**
 *
 * @namespace
 */
TangoWebappPlatform.mixin = {
    /**
     *
     * Requires `on` property to be defined
     *
     * @type {webix.mixin}
     */
    OpenAjaxListener: {
        _listener_controller: null,
        _listener_instance: null,
        $init: function (config) {
            this._listener_controller = MVC.Controller.extend(config.id, this, this.defaults.on);
            this._listener_instance = new this._listener_controller();
        }
    },
    /**
     *
     * @type {webix.mixin}
     */
    TabActivator: {
        _is_active: false,
        activate: function () {
            this.show(true);
            this._is_active = true;
        }
    },
    /**
     *
     * @type {webix.mixin}
     */
    DeviceSetter: {
        device_setter: function (device) {
            if (!device) TangoWebappPlatform.error("device can not be undefined");
            this._device = device;
            return device;
        }
    },
    /**
     * Performs action defined in run function only if this component is visible
     *
     * @type {webix.mixin}
     */
    Runnable: {
        _delay: 1000,
        _intervalId: 0,
        start: function () {
            this._intervalId = setInterval(function () {
                if (!this.$destructed && this.isVisible())
                    this.run();
            }.bind(this), this._delay);
            if(this.before_start !== undefined && typeof this.before_start === 'function')
                this.before_start();
        },
        isRunning:function(){
            return this._intervalId !== 0;
        },
        changeDelay: function (delay) {
            this._delay = delay;
            this.stop();
            this.start();
        },
        stop: function () {
            clearInterval(this._intervalId);
            this._intervalId = 0;
            if(this.after_stop !== undefined && typeof this.after_stop === 'function')
                this.after_stop();
        }
    }
};
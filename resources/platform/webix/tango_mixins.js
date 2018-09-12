/**
 *
 * @namespace mixins
 */
TangoWebappPlatform.mixin = {
    /**
     *
     * Requires `on` property to be defined
     *
     * @type {webix.mixin}
     * @property {function} on
     * @memberof mixins
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
     * @memberof mixins
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
     * @memberof mixins
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
     * @memberof mixins
     */
    Runnable: {
        _delay: 1000,
        _intervalId: 0,
        /**
         * @memberof mixins.Runnable
         */
        start: function () {
            this._intervalId = setInterval(function () {
                if (!this.$destructed && this.isVisible())
                    this.run();
            }.bind(this), this._delay);
            if(this.before_start !== undefined && typeof this.before_start === 'function')
                this.before_start();
        },
        /**
         * @returns {boolean}
         * @memberof mixins.Runnable
         */
        isRunning:function(){
            return this._intervalId !== 0;
        },
        /**
         * @param {number} delay
         * @memberof mixins.Runnable
         */
        changeDelay: function (delay) {
            this._delay = delay;
            this.stop();
            this.start();
        },
        /**
         * @memberof mixins.Runnable
         */
        stop: function () {
            clearInterval(this._intervalId);
            this._intervalId = 0;
            if(this.after_stop !== undefined && typeof this.after_stop === 'function')
                this.after_stop();
        }
    },
    /**
     *
     * @type {webix.mixin}
     * @memberof mixins
     */
    Stateful: {
        state: null,

        $init:function(config){
            config.state_class = config.state_class || TangoWebappPlatform.WidgetState;
            this.$ready.push(function(){
                this.state = this.config.state_class.find_one(this.config.id);
                if(this.state !== null) {
                    this.restoreState(this.state);
                    TangoWebappHelpers.log("Widget["+this.config.id+"] state is restored.");
                } else
                    this.state = new this.config.state_class({
                        id: this.config.id
                    })
            }.bind(this));
        }
    }
};
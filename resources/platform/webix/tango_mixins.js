/**
 * Aggregates TangoWebappPlatform webix mixins.
 *
 * More info: {@link https://docs.webix.com/api__toc__ui_mixins.html mixins}
 *
 * @namespace mixins
 */
TangoWebappPlatform.mixin = {
    /**
     *
     * Requires `on` property to be defined in the protoUI
     *
     * @example <caption>Inject into protoUI</caption>
     * webix.protoUI({...},TangoWebappPlatform.mixin.OpenAjaxListener,webix.ui.view)
     *
     * @example <caption>Define subscription</caption>
     * webix.protoUI({
     *   defaults:{
     *     on:{
     *       "my_event subscribe":function(event){...}
     *     }
     *   }
     * },TangoWebappPlatform.mixin.OpenAjaxListener,webix.ui.view)
     *
     * @example <caption>Fire event</caption>
     * //somewhere
     * OpenAjax.hub.publish("my_event", {data:{...}})
     *
     * @type {webix.mixin}
     * @memberof mixins
     */
    OpenAjaxListener: {
        _actions:[],
        _listener_controller: null,
        _listener_instance: null,
        $init: function (config) {
            for(var subscription in this.defaults.on){
                if (typeof this.defaults.on[subscription] === 'function'
                    && MVC.Controller.Action.Subscribe.matches(subscription) !== null) {
                    const that = this;
                    this._actions.push(new MVC.Controller.Action.Subscribe(subscription,
                        (function (cb) {
                            return function () {
                                try {
                                    cb.apply(that, Array.from(arguments));
                                } catch (e) {
                                    TangoWebappHelpers.error("Failed to execute $$('" + config.id + "')['" + subscription + "'] due to " + e, e)
                                }
                            }
                        })(this.defaults.on[subscription])
                    ))
                }
            }
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
     * User may define before_start and/or after_stop to perform extra action before/after start/stop
     *
     * @type {webix.mixin}
     * @property {function} [before_start]
     * @property {function} [after_stop]
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
        }
    },
    /**
     * State is stored in {@link UserContext#ext} e.g. user_context.ext[this.id] = this.state
     *
     * Requires restoreState instance member to be defined
     *
     * @example
     * webix.protoUI({
     *    restoreState:function(state:WidgetState){...}
     * }, TangoWebappPlatform.mixin.Stateful, ...)
     *
     *
     * @type {webix.mixin}
     * @property {MVC.Class} state_class -- {@link WidgetState} by default
     * @property {function(WidgetState)} restoreState
     * @memberof mixins
     */
    Stateful: {
        getInitialState() {
            return Object.create(null)
        },
        getStateId() {
            return this.config.id;
        },
        state: null,

        $init:function(config){
            config.state_class = config.state_class || TangoWebappPlatform.WidgetState;
            this.$ready.push(function(){
                setTimeout(()=>{
                    this.state = this.config.state_class.find_one(this.getStateId());
                    if(this.state === null) {
                        this.state = new this.config.state_class({
                            id: this.getStateId(),
                            data: this.getInitialState()
                        })
                    }
                    this.restoreState(this.state);
                    TangoWebappHelpers.log(`Widget[${this.config.id}] state[${this.getStateId()}] is restored.`);
                },0);
            }.bind(this));
        }
    },
    ToggleSettings:{
        toggleSettings(){
            const $$settings = this.$$('settings');
            if($$settings.isVisible()){
                this.hideSettings();
            } else {
                this.showSettings();
            }
        },
        hideSettings(){
            const $$settings = this.$$('settings');
            $$settings.hide();
            this.state.updateState({
                hide_settings : true
            });
        },
        showSettings(){
            const $$settings = this.$$('settings');
            $$settings.show();
            this.state.updateState({
                hide_settings : false
            });
        }
    },
    BoundedReverseList: {
        limit: 100,
        addFirst: function (item) {
            const id = this.add(item);
            this.moveTop(id);
            while (this.data.count() > (this.config.limit || this.limit)) {
                this.remove(this.getLastId());
            }
        }
    }
};

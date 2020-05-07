import {kTangoRestContext} from "controllers/tango_rest";
import {kUserContext} from "controllers/user_context";
import {kControllerUserAction} from "controllers/user_action_controller";

export const BoundedReverseList = {
    limit : 100,
    addFirst(item) {
        const id = this.add(item);
        this.moveTop(id);
        while (this.data.count() > (this.config.limit || this.limit)) {
            this.remove(this.getLastId());
        }
    }
}

//TODO instead of webix mixin this should be WaltzWidget extension
export const Stateful = {
    /**
     *
     * @param state
     */
    restoreState(state){

    },

    async updateAndSafeState(){
        const context = await this.config.userContextController.get();
        Object.assign(context[this.getStateId()], this.state);
        this.config.userContextController.save()
    },

    async setAndSafeState(){
        const context = await this.config.userContextController.get();
        context[this.getStateId()] = this.state;
        this.config.userContextController.save()
    },

    getInitialState() {
        return Object.create(null)
    },
    getStateId() {
        return this.config.id;
    },
    state: null,

    $init:function(config){
        if(config.userContextController === null || config.userContextController === undefined) throw new Error(`Can not initialize stateful Widget[${this.config.id}]: config.userContext is null or undefined!`);

        config.userContextController.get().then(userContext => {
            this.state = userContext[this.getStateId()] || this.getInitialState();

            this.restoreState(state);
            console.debug(`Widget[${this.config.id}] state[${this.getStateId()}] is restored.`);
        });
    }
}

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
export const Runnable = {
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
}

export const WaltzWidgetMixin = {
    /**
     *
     * @return {Promise<TangoRestApi>}
     */
    getTangoRest(){
        return this.config.root.app.getContext(kTangoRestContext);
    },

    /**
     *
     * @return {Promise<UserContext>}
     */
    getUserContext(){
        return this.config.root.app.getContext(kUserContext);
    },

    /**
     *
     * @return {UserActionController}
     */
    getUserActionsController(){
        return this.config.root.app.getController(kControllerUserAction);
    }
}
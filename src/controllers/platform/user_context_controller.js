TangoWebappPlatform.UserContextController = class extends MVC.Controller {
    static get className(){
        return "user_context_controller";
    }
    static get _attach_actions(){
        return false;
    }

    /**
     * Defines global var UserContextController
     *
     * @constructs
     * @param user_context
     */
    constructor(user_context) {
        super();
        this._user_context = user_context;
    }
    /**
     *
     * @param user
     * @event {OpenAjax} user_context_controller.found
     */
    find_user_context(user){
        var found = TangoWebappPlatform.UserContext.find_one(user);
        window.UserContext = found;
        this.publish('user_context_controller.found', {data: found});
    }
    /**
     * Does nothing if tango_host is already exist
     *
     * @param {string} tango_host
     *
     * @event {OpenAjax} user_context_controller.add_tango_host
     */
    add_tango_host(tango_host) {
        if (this._user_context.tango_hosts.hasOwnProperty(tango_host)) return;
        this._user_context.tango_hosts[tango_host] = "";
        this._user_context.save();
        this.publish("user_context_controller.add_tango_host", {
            context: this._user_context,
            data: tango_host
        })
    }
    /**
     * Does nothing if tango_host is already deleted
     *
     * @param tango_host
     *
     * @event {OpenAjax} user_context_controller.delete_tango_host
     */
    delete_tango_host(tango_host) {
        if (!this._user_context.tango_hosts.hasOwnProperty(tango_host)) return;
        delete this._user_context.tango_hosts[tango_host];
        this._user_context.save();
        this.publish("user_context_controller.delete_tango_host", {
            context: this,
            data: tango_host
        })
    }
    /**
     *
     * @param attrs
     *
     * @event {OpenAjax} user_context_controller.update_attributes
     */
    update_attributes(attrs) {
        this._user_context.update_attributes(attrs);
        this.publish("user_context_controller.update", {data: this});
    }
    /**
     *
     * @event {OpenAjax} user_context_controller.destroy
     */
    destroy(){
        this._user_context.destroy();
        UserContext = null;
        this.publish("user_context_controller.destroy", {data: this});
    }


};

TangoWebappPlatform.UserContextController.initialize();

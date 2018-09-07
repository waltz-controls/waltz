/**
 * Model widget_state
 * @namespace {TangoWebappPlatform}
 * @property {string} id
 * @property {Object} data
 * @extends MVC.Model
 */
TangoWebappPlatform.WidgetState = MVC.Model.extend('widget_state',
    /** @lends  TangoWebappPlatform.WidgetState */
    {
        store_type: TangoWebappPlatform.UserContextStore,
        attributes: {
            id: 'string',
            data: 'Object'
        },
        default_attributes: {}
    },
    /** @lends  TangoWebappPlatform.WidgetState.prototype */
    {
        /**
         * @param attrs
         * @constructs
         */
        init:function(attrs){
            attrs.data = attrs.data || Object.create(null);
            this._super(attrs);
            this.Class.store.context.ext[this.id] = this.attributes();
        },
        /**
         * @return {Object}
         */
        getState:function () {
            return this.data;
        },
        /**
         * Sets new state
         * @param {Object} state
         */
        setState:function(state){
            this.update_attributes({
                data: state
            });
        },
        /**
         * Updates existing state
         * @param {Object} state
         */
        updateState:function(state){
            this.update_attributes({
                data: MVC.Object.extend(this.data, state)
            });
        }
    }
    );
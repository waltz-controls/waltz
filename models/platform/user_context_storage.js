/**
 * UserContext adaptor for StoreType
 * @class
 * @type {UserContextStore}
 * @extends MVC.Class
 */
TangoWebappPlatform.UserContextStore = MVC.Class.extend(
    /** @lends  TangoWebappPlatform.UserContextStore.prototype */
    {
        /** @member {subscriptions} */
        subscriptions:[],
        /**
         * @param event
         */
        onUserContextCreated:function(event){
            this.context = event.data;
        },
        /**
         * @param event
         */
        onUserContextDestroyed:function (event) {
            if(this.context === event.data)
                this.context = null;
        },
        /**
         * @constructs
         * @param {Object} klass
         */
        init: function (klass) {
            this.storing_class = klass;
            this.context = null;
            this.subscriptions.push(
                new MVC.Controller.Action.Subscribe("user_context.create.as_existing subscribe",this.onUserContextCreated.bind(this)),
                new MVC.Controller.Action.Subscribe("user_context.destroy subscribe",this.onUserContextDestroyed.bind(this))
            );
        },
        /**
         *
         * @param {Object} id
         */
        find_one: function (id) {
            return this.context.ext[id] !== undefined ? this.context.ext[id] : null;
        },
        /**
         * Finds instances using a test function.  If no test function is provided returns all instances.
         * @param {Function} f
         * @return {Array}
         */
        find : function(f){
            if(typeof f === 'function') throw new TypeError('TangoWebappPlatform.UserContextStore does not support find by function');
            return [this.find_one(f)];
        },
        /**
         * WARNING!!! This function may corrupt data see TODO
         * @param {MVC.Model} obj
         */
        create: function (obj) {
            var id = obj[obj.Class.id];
            this.context.ext[id] = obj.attributes();
        },
        /**
         * @param {Object} id
         * @param {Object} attrs
         */
        update: function (id, attrs) {
            var context_attrs = {
                ext: this.context.ext
            };
            context_attrs.ext[id] = MVC.Object.extend(this.context.ext[id], attrs);
            this.context.update_attributes(context_attrs);
        },
        /**
         * @param {Object} id
         */
        destroy: function (id) {
            delete this.context.ext[id];
            this.context.save();
        },
        /**
         * Clears instances
         */
        clear: function () {

        },
        /**
         * Returns if there is no instances
         * @return {Boolean}
         */
        is_empty: function () {
            return false;
        }
    }
    );
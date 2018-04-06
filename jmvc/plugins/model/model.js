/**
 * Models wrap an application's data layer.  This is done in two ways:
 * <ul>
 *     <li>Requesting data from and interacting with services</li>
 *     <li>Wrap service data with a domain-specific representation</li>
 * </ul>
 * A strong model layer keeps your code organized and maintainable, but it typically
 * is the least developed part of the MVC architecture.  This guide introduces you
 * to the basics of how a model should work.  Note that much of what it demonstrates could be
 * done easier with a different base Model class such as [MVC.Model.Ajax|Model.Ajax].
 * <h2>Services</h2>
 * Your models should be the way you communicate with the server.  Instead of using
 * Ajax/XHR requests directly, perform those requests in a model.
 *
 * For example:
 @code_start
 <pre>
 //instead of:
 new Ajax('/tasks.json', {onComplete: find_tasks_next_week })
 //do this:
 Task.find('all', find_tasks_next_week)

 //instead of
 new Ajax('/tasks/'+id+'/complete.json',{onComplete: task_completed})
 //do this:
 task.complete(task_completed)
 </pre>
 @code_end
 Typically there are two types of services any application connects to:
 <ul>
 <li>Group - operate on many instances.  Ex: getting all tasks for a user.</li>
 <li>Singular - operate on one instance. Ex: completing a task. </li>
 </ul>
 For these types of services, you will want to build them in slightly different ways.
 <h3>Group Services</h3>
 Group services that request data should look like the following:
 @code_start
 <pre>
 Task = MVC.Model.extend('task',
 {
   find : function(params, callback){
     new Ajax('/tasks.json', {onComplete: MVC.Function.bind(function(response){
         //get data into the right format for create_as_existing
         var data =  eval('('+json_string+')');
         //call create_as_existing to create instances
         var instances = this.create_many_as_existing(data);
         //call back with data.
         callback(instances)
     }) })
   }
 },
 {})
 </pre>
 @code_end
 Note this function uses [MVC.Model.static.create_many_as_existing|create_many_as_existing]
 to create new instances.  By using create_many_as_existing, the model will also publish
 [OpenAjax|OpenAjax.hub] messages that can be listed to by controllers.
 <h3>Singular Service</h3>
 Singular services that minipulate data might look like:
 @code_start
 <pre>
 Task = MVC.Model.extend('task',
 {},
 {
   complete: function(callback){
     new Ajax('/tasks/'+this.id+'/complete.json', {onComplete: MVC.Function.bind(function(response){
         this.completed = true;
         callback(this)
         this.publish("completed")
     }) })
   }
 })
 </pre>
 @code_end
 <h2>Wrapping Data</h2>
 Now that you have instances, you can wrap their data in useful ways.  This is done by adding
 functions to the Model's prototype methods.  For example:
 @code_start
 <pre>
 Task = MVC.Model.extend('task',
 {},
 {
   status : function(){
     return this.complete ? "COMPLETE" : "INCOMPLETE"
   }
 })
 </pre>
 @code_end
 * <h3>P</h3>
 * <ul>
 *     <li>Model.find_one(params, callbacks)</li>
 *     <li>Model.find_all(params, callbacks)</li>
 *     <li>Model.create(attributes, callbacks)</li>
 *     <li>Model.update(id, attributes, callbacks)</li>
 *     <li>Model.destroy(id, callbacks)</li>
 * </ul>
 *
 * There three are possible callbacks can be passed to the upper methods:
 * <ul>
 *     <li> onSuccess -- called after onComplete if request was successful
 *     <li> onFailure -- called after onComplete if response has failed
 *     <li> onComplete -- called after a response arrives, typically defined by the model, user should use two previous callbacks
 * </ul>
 *
 * onComplete is 'reserved' for specialized models, like JsonP where status of the response is determined in this callback
 * user though may overwrite this behavior by passing single onComplete callback
 *
 *
 * <h2>Using Stores</h2>
 * Model keeps all instances of a class in a [MVC.Store|Store].  Stores provide an easy way of
 * looking up instances by id.
 *
 * <h2>Using OpenAjax</h2>
 *
 */
MVC.Model = MVC.Class.extend(
    /* @Static*/
    {
        store_type             : MVC.Store,
        /**
         * Creates this model Class instance
         *
         * @constructor
         */
        init                   : function () {
            if (!this.className) return;
            MVC.Model.models[this.className] = this;
            this.store = new this.store_type(this);

            for (var association in this.associations) {
                if (!this.associations.hasOwnProperty(association)) continue;

                switch (association) {
                    case 'has_many':
                        this._has_many.apply(this, this.associations['has_many']);
                        break;
                    case 'has':
                        this._has.apply(this, this.associations['has']);
                        break;
                    //TODO belongs_to
                    default:
                        throw 'Unknown association ' + association;
                }
            }
        },
        /**
         * Creates an instance of this model from a json string
         *
         * @param {String} json
         */
        from_json              : function (json) {
            var attributes = MVC.Object.from_json(json);
            this.create_as_existing(attributes);
        },
        /**
         * Finds objects in this class
         *
         * Inherited models may redefine this method to perform a request
         *
         * @param {Object} id the id of a object
         * @param {Object} params params passed to the
         * @param {Object} cbks callbacks object
         * @return {Model} will return instances of the model if synchronous
         */
        find_one              : function (id, params, cbks) {
            if (!params)  params = {};
            if (typeof params == 'function'  || (params.onSuccess || params.onFailure)) {
                cbks = params;
                params = {};
            }
            var callbacks = this._clean_callbacks(cbks);
            var attributes = this.store.find_one(id, callbacks);
            if(attributes != null && attributes.Class){
                return attributes;
            }
            if(attributes != null) {
                var inst = this.create_as_existing(attributes);
                if (inst) callbacks.onSuccess(inst);
                return inst;
            }
            return null;
        },
        /**
         * Lookups for data in the local storage
         *
         * @param {Function|string} f -- filter function or 'all'
         * @return {Array}
         */
        find:function(f){
            if(f == 'all') f = 0;
            return this.store.find(f)
        },
        /**
         * Finds all instances that satisfies filter function or all, if no filter function is provided
         *
         * @param {Function} f a filter function
         * @return {Array}
         */
        find_all               : function (params, cbs) {
            var filter;
            if (typeof params == 'function') filter = params;
            if (params && params.filter && typeof params.filter == 'function') filter = params.filter;
            var callbacks = this._clean_callbacks(cbs);
            var result = this.store.find(filter);
            callbacks.onSuccess(result);
            return result;
        },
        asynchronous           : true,
        /**
         * Creates an instance of this model asynchronously
         *
         * @param {Object} attributes -- new instance's attributes
         * @param {Object} cbks -- callbacks. At least onSuccess must be provided
         */
        create                 : function (attributes, cbks) {
            var callbacks = this._clean_callbacks(cbks);
            callbacks.onSuccess(this.create_as_existing(attributes));
        },
        /**
         * This method does not actually updates values and should not be called directly
         * use update_attributes instance method to really update
         *
         * @param id
         * @param attributes
         * @param {Object} cbks -- callbacks. At least onSuccess must be provided
         */
        update                 : function (id, attributes, cbks) {
            var inst = this.find(id);
            if (!inst) throw "Instance[id=" + id + "] was not found!";
            var callbacks = this._clean_callbacks(cbks);
            this.publish("update", {data: inst});
            callbacks.onSuccess(inst);
        },
        /**
         *
         */
        destroy:function(id, cbks){
            if(this.store.find_one(id)) this.store.destroy(id);
            var callbacks = this._clean_callbacks(cbks);
            this.publish("destroy", {});
            callbacks.onSuccess();
        },
        /**
         * Used to create an existing object from attributes
         *
         * Publishes 'create.as_existing' event
         *
         * @param {Object} attributes
         * @return {Model} an instance of this model
         */
        create_as_existing     : function (attributes) {
            if (!attributes) attributes = {};
            if (attributes.attributes) attributes = attributes.attributes();
            var inst = new this(attributes);
            inst.is_new_record = this.new_record_func;

            this.publish("create.as_existing", {data: inst});

            //if(MVC.Controller) MVC.Controller.publish(this.className + ":create_as_existing", );
            return inst;
        },
        /**
         * Creates instances of this model from an array of attributes
         *
         * @param {Array} instances
         * @return {Array} an array of instances of this model
         */
        create_many_as_existing: function (instances) {
            var res = [];
            if (!instances) return res;
            for (var i = 0; i < instances.length; i++)
                res.push(this.create_as_existing(instances[i]));
            return res;
        },
        /**
         * The name of the id field.  Defaults to 'id'
         */
        id                     : 'id', //if null, maybe treat as an array?
        new_record_func        : function () {
            return false;
        },
        /**
         * An object attr->function which will be applied to the instance of this model when validate method is invoked
         *
         * Each function returns an object: attr->error (simply text) or nothing
         *
         */
        validations            : {},
        _validate_many:function(attribute) {
            return function (inst) {
                var result = [];

                for (var i = 0, size = inst[attribute].length; i < size; ++i) {
                    inst[attribute][i].validate();
                    result.push(inst[attribute][i].errors)
                }

                return result.length > 0 ? result : null;
            }
        },
        _validate_one:function(attribute) {
            return function (inst) {
                inst[attribute].validate();
                if (!inst[attribute].valid()) return inst[attribute].errors;
            }
        },
        _has_many               : function () {
            for (var i = 0; i < arguments.length; i++) {
                this._associations.push(MVC.String.pluralize(arguments[i]));
            }
        },
        _has                    : function () {
            for (var i = 0; i < arguments.length; i++) {
                this._associations.push(arguments[i]);
            }
        },
        _belongs_to             : function () {
            for (var i = 0; i < arguments.length; i++) {
                this._associations.push(arguments[i]);
            }
        },
        associations           : {
            has_many: [],
            has     : []
        },
        _associations          : [],
        /**
         * Takes an element ID like 'todo_5' and returns '5'
         * @param {Object} element_id
         * @return {String}
         */
        element_id_to_id       : function (element_id) {
            var re = new RegExp(this.className + '_', "i");
            return element_id.replace(re, '');
        },
        /**
         * Returns an instance if one can be found in the store.
         * @param {Object} el
         */
        find_by_element        : function (el) {
            return this._find_by_element(MVC.$E(el), this.className, this);
        },
        _find_by_element       : function (ce, modelName, model) {
            var matches, id, matcher = new RegExp("^" + modelName + "_(.*)$");
            if (ce && ce.id && (matches = ce.id.match(matcher) ) && matches.length > 1) {
                id = matches[1]
            } else {
                id = ce.has_class(matcher)[1]
            }
            return model.store.find_one(id);
        },
        /**
         * Adds an attribute to the list of attributes for this class.
         * @param {String} property
         * @param {String} type
         */
        add_attribute          : function (property, type) {
            //TODO set association
            if (!this.attributes[property])
                this.attributes[property] = type;
            if (!this.default_attributes[property])
                this.default_attributes[property] = null;
        },
        attributes             : {},
        default_attributes     : {},
        /**
         * Used for converting callbacks to to seperate failure and succcess
         * @param {Object} callbacks
         */
        //TODO should we really always return onComplete and onFailure?
        _clean_callbacks       : function (callbacks) {
            if (!callbacks) {
                callbacks = function () {
                };
            }
            if (typeof callbacks == 'function')
                return {onSuccess: callbacks, onFailure: callbacks};
            if (!callbacks.onSuccess && !callbacks.onComplete) throw "You must supply a positive callback!";
            if (!callbacks.onSuccess) callbacks.onSuccess = callbacks.onComplete;
            if (!callbacks.onFailure && callbacks.onComplete) callbacks.onFailure = callbacks.onComplete;
            return callbacks;
        },
        models                 : {},
        /**
         * Creates a callback function that will call back the function on the static class.
         * If other arguments are passed, they will be added before the parameters used to call the callback.
         * @param {String} fname
         * @return {Function} a callback function useful for Ajax calls
         */
        callback               : function (fname) {
            var f = typeof fname == 'string' ? this[fname] : fname;
            var args = MVC.Array.from(arguments);
            args.shift();
            args.unshift(f, this);
            return MVC.Function.bind.apply(null, args);
        },
        /**
         * Publishes to open ajax hub.  Always adds the className.event
         * @param {Object} event
         * @param {Object} data
         */
        publish                : function (event, data) {
            OpenAjax.hub.publish(this.className + "." + event, data);
        },
        /**
         * Namespaces are used to publish messages to a specific namespace.
         * @code_start
         * <pre>
         * Org.Task = MVC.Model.extend('task',{
     *   namespace: "org"
     * },
         * {
     *   update: function(){
     *     this.publish("update") // publishes 'this' to 'org.task.update'
     *   }
     * })
         * </pre>
         * @code_end
         */
        namespace              : null
    },
    /* @Prototype*/
    {
        /**
         * Creates, but does not save a new instance of this class
         * @param {Object} attributes -> a hash of attributes
         */
        init             : function (attributes) {
            //this._properties = [];
            attributes = attributes || {};
            this.errors = [];
            if (attributes.errors) {
                this.add_errors(attributes.errors);
                delete attributes.errors;
            }

            this.set_attributes(this.Class.default_attributes || {});
            this.set_attributes(attributes);
        },
        /**
         * Sets a hash of attributes for this instance
         * @param {Object} attributes
         */
        set_attributes   : function (attributes) {
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key))
                    this._setAttribute(key, attributes[key]);
            }
            return attributes;
        },
        /**
         * Sets the attributes on this instance and calls save.
         * @param {Object} attributes
         * @param {Object} callback
         */
        update_attributes: function (attributes, callback) {
            this.set_attributes(attributes);
            return this.save(callback);
        },
        /**
         * Determines if this instance has no errors
         *
         * @returns {boolean}
         */
        valid            : function () {
            return this.errors.length == 0;
        },
        /**
         * Validates this instance
         */
        validate         : function () {
            //reset
            this.errors = [];
            var attributes = this.attributes();
            for(var attr in attributes){
                if(!this.hasOwnProperty(attr) || typeof(this.Class.validations[attr]) != 'function') continue;
                var error_msg = this.Class.validations[attr](this);
                if(error_msg != null) {
                    var error = {};
                    error[attr] = error_msg;
                    this.errors.push(error);
                }
            }
        },
        _setAttribute    : function (attribute, value) {
            if (MVC.Array.include(this.Class._associations, this.Class.attributes[attribute]))
                this._setAssociation(attribute, value);
            else
                this._setProperty(attribute, value);
        },
        /**
         * Checks if there is a set_<i>property</i> value.  If it returns true, lets it handle; otherwise
         * saves it.
         * @param {Object} property
         * @param {Object} value
         */
        _setProperty     : function (property, value) {
            if (this["set_" + property] && !this["set_" + property](value)) {
                return;
            }
            //add to cache, this should probably check that the id isn't changing.  If it does, should update the cache
            var old = this[property];


            this[property] = MVC.Array.include(['created_at', 'updated_at'], property) ? MVC.Date.parse(value) : value;
            if (property == this.Class.id && this[property]) {
                this.is_new_record = this.Class.new_record_func;
                if (this.Class.store) {
                    if (!old) {
                        this.Class.store.create(this);
                    } else if (old != this[property]) {
                        this.Class.store.destroy(old);
                        this.Class.store.create(this);
                    }
                }

            }
            //if (!(MVC.Array.include(this._properties,property))) this._properties.push(property);
            else
                this.Class.add_attribute(property, MVC.Object.guess_type(value));
        },
        _setAssociation  : function (attribute, values) {
            var association = this.Class.attributes[attribute];

            var hasMany = !MVC.String.is_singular(association);

            var associated_class = (hasMany) ? window[MVC.String.singularize(association)] : window[association];
            if (!associated_class)
                this[attribute] = values;
            else if (hasMany) {
                this[attribute] = associated_class.create_many_as_existing(values);
                this.Class.validations[attribute] = this.Class._validate_many(attribute);
            } else {
                this[attribute] = associated_class.create_as_existing(values);
                this.Class.validations[attribute] = this.Class._validate_one(attribute);
            }
        },
        /**
         * Returns this model's attributes
         *
         * Associated models include their attributes as nested objects into the result
         *
         * @return {Object}
         */
        attributes       : function () {
            var attributes = {};
            var cas = this.Class.attributes;
            for (var attr in cas) {
                if (cas.hasOwnProperty(attr)) {
                    if (MVC.Array.include(this.Class._associations, this.Class.attributes[attr]))
                        if(MVC.Array.include(this.Class.associations.has, this.Class.attributes[attr]))
                            attributes[attr] = this[attr].attributes();
                        else {
                            var result = [];
                            for (var i = 0, size = this[attr].length; i < size; ++i) {
                                result.push(this[attr][i].attributes());
                            }
                            attributes[attr] = result;
                        }
                    else
                        attributes[attr] = this[attr];
                }
            }
            return attributes;
        },
        /**
         * Returns if the instance is a new object
         */
        is_new_record    : function () {
            return true;
        },
        /**
         * Saves the instance
         * @param {Function} callbacks onComplete function or object of callbacks
         */
        save             : function (callbacks) {
            var result;
            this.errors = [];
            this.validate();
            if (!this.valid()) return false;
            result = this.is_new_record() ?
                this.Class.create(this.attributes(), callbacks) :
                this.Class.update(this[this.Class.id], this.attributes(), callbacks);

            this.is_new_record = this.Class.new_record_func;
            return true;
        },
        /**
         * Destroys this instance
         *
         * @param {Function} callback or object of callbacks
         */
        destroy          : function (callback) {
            this.Class.store.destroy(this[this.Class.id]);
            this.Class.destroy(this[this.Class.id], callback);
        },
        /**
         * Add  errors to this instance
         *
         * @param {Array} errors
         */
        add_errors       : function (errors) {
            //TODO accept var args
            if (errors) this.errors = this.errors.concat(errors);
        },
        /**
         * Checks whether this instance has errors
         *
         * @return {boolean}
         */
        has_errors: function(){
            return this.errors.length !== 0;
        },
        _resetAttributes : function (attributes) {
            this._clear();
            /*for (var attr in attributes){
             if(attributes.hasOwnProperty(attr)){
             this._setAttribute(attr, attributes[attr]);
             }
             }*/
        },
        _clear           : function () {
            var cas = this.Class.default_attributes;
            for (var attr in cas) {
                if (cas.hasOwnProperty(attr)) this[attr] = null;
            }
        },
        /**
         * Returns the suggested element id for this instance
         */
        element_id       : function () {
            return this.Class.className + '_' + this[this.Class.id];
        },
        /**
         * Returns an html element found by using element_id for this instance
         *
         * @returns {*}
         */
        element          : function () {
            return MVC.$E(this.element_id());
            ;
        },
        /**
         * Returns html elements with this element_id class
         *
         * @returns {*}
         */
        elements         : function () {
            return MVC.Query("." + this.element_id());
        },
        /**
         * Publishes to open ajax hub
         * @param {String} event
         * @param {optional:Object} data if missing, uses the instance in {data: this}
         */
        publish          : function (event, data) {
            this.Class.publish(event, data || {data: this});
        },
        /**
         * Creates a callback function that will call back the function on the instance.
         * If other arguments are passed, they will be added before the parameters used to call the callback.
         * @param {String} fname
         * @return {Function} a callback function useful for Ajax calls
         */
        callback         : function (fname) {
            var f = typeof fname == 'string' ? this[fname] : fname;
            var args = MVC.Array.from(arguments);
            args.shift();
            args.unshift(f, this);
            return MVC.Function.bind.apply(null, args);
        }
    });


MVC.Object.guess_type = function (object) {
    if (typeof object != 'string') {
        if (object == null) return typeof object;
        if (object.constructor == Date) return 'date';
        if (object.constructor == Array) return 'array';
        return typeof object;
    }
    //check if true or false
    if (object == 'true' || object == 'false') return 'boolean';
    if (!isNaN(object)) return 'number'
    return typeof object;
}

if (!MVC._no_conflict && typeof Model == 'undefined') {
    Model = MVC.Model;
}
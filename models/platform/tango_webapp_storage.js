/**
 * Model tango_webapp_storage
 * @namespace {TangoWebappPlatform}
 * @memberof TangoWebappPlatform
 * @extends MVC.Class
 */
TangoWebappStorage = MVC.Class.extend(
    /** @lends  TangoWebappPlatform.TangoWebappStorage.prototype */
    {
        /**
         * @constructs
         * @param {Object} klass
         */
        init: function (klass) {
            this.key = klass.className;
            this.storing_class = klass;
            if(localStorage.getItem(this.key) == null) {
                localStorage.setItem(this.key, "{}");
            }
        },
        /**
         * @param {Object} id
         */
        find_one: function (id) {
            return id ? JSON.parse(localStorage.getItem(this.key))[id] : null;
        },
        /**
         * @param {Object} obj
         */
        create: function (obj) {
            var id = obj[obj.Class.id];
            this.update(id, obj.attributes());
        },
        /**
         * @param id
         * @param attrs
         */
        update: function (id, attrs) {
            var data = JSON.parse(localStorage.getItem(this.key));
            data[id] = attrs;
            localStorage.setItem(this.key, JSON.stringify(data));
        },
        /**
         * @param {Object} id
         */
        destroy: function (id) {
            var data = JSON.parse(localStorage.getItem(this.key));
            delete data[id];
            localStorage.setItem(this.key, JSON.stringify(data));
        },
        /**
         * Finds instances using a test function.  If no test function is provided returns all instances.
         * @param {Function} f
         * @return {Array}
         */
        find: function (f) {
            var instances = [];
            var data = JSON.parse(localStorage.getItem(this.key));
            for (var id in data) {
                var inst = data[id];
                if (!f || f(inst))
                    instances.push(inst);
            }
            return this.storing_class.create_many_as_existing(instances);
        },
        /**
         * Clears instances
         */
        clear: function () {
            localStorage.setItem(this.key, "{}");
        },
        /**
         * Returns if there is no instances
         * @return {Boolean}
         */
        is_empty: function () {
            return !this.find().length;
        }
    });
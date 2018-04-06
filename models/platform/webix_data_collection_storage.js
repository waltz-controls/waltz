/**
 * MVC store adaptor for webix.DataCollection
 *
 * @type {WebixDataCollectionStorage}
 */
var WebixDataCollectionStorage = MVC.Class.extend(
    /* @prototype */
    {
        _data: null,
        /**
         *
         * @param {Object} klass
         */
        init: function (klass) {
            this.storing_class = klass;
            this._data = new webix.DataCollection();
        },
        /**
         *
         * @param {Object} id
         */
        find_one: function (id) {
            return this._data.getItem(id);
        },
        /**
         *
         * @param {Object} obj
         */
        create: function (obj) {
            obj[obj.Class.id] = this._data.add(obj);
        },
        /**
         * Updates stored instance
         *
         * @param id
         * @param attrs
         */
        update: function (id, attrs) {
            this._data.updateItem(id, attrs);
        },
        /**
         *
         * @param {Object} id
         */
        destroy: function (id) {
            this._data.remove(id);
        },
        /**
         * Finds instances using a test function.  If no test function is provided returns all instances.
         * @param {Function} f
         * @return {Array}
         */
        find: function (f) {
            f = f || function () {
                return true;
            };
            if(typeof f === 'function')
                return this._data.find(f);
            else
                return this._data.getItem(f);//assume f is an id
        },
        /**
         * Clears instances
         */
        clear: function () {
            this._data.clearAll();
        },
        /**
         * Returns if there is no instances
         * @return {Boolean}
         */
        is_empty: function () {
            return this._data.count() === 0;
        }
    });

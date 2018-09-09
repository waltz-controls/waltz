/**
 * MVC store adaptor for webix.DataCollection
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Class.html MVC.Class}
 * @namespace {TangoWebappPlatform}
 * @memberof TangoWebappPlatform
 */
var WebixDataCollectionStorage = MVC.Class.extend(
    /** @lends  TangoWebappPlatform.WebixDataCollectionStorage.prototype */
    {
        _data: null,
        /**
         * @constructs
         * @param {Object} klass
         */
        init: function (klass) {
            this.storing_class = klass;
            this._data = (function () {
                if (MVC.Browser.Rhino) //TODO :( get rid off Nashorn
                    return {};
                else return new webix.DataCollection({
                    defaultData: klass.default_attributes
                });
            })();
        },
        /**
         * @param {Object} id
         */
        find_one: function (id) {
            return this._data.getItem(id);
        },
        /**
         * @param {Object} obj
         */
        create: function (obj) {
            if(obj.Class.id !== 'id') obj.id = obj[obj.Class.id];
            obj[obj.Class.id] = this._data.add(obj);
        },
        /**
         * Updates stored instance
         * @param id
         * @param attrs
         */
        update: function (id, attrs) {
            this._data.updateItem(id, attrs);
        },
        /**
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

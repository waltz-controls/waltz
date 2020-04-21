/**
 * Model data_collection_wrapper
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @class
 * @memberof TangoWebappPlatform
 */
TangoWebappPlatform.DataCollectionWrapper = MVC.Model.extend(
    /** @lends  TangoWebappPlatform.DataCollectionWrapper.prototype */
    {
        /**
         * @instance
         * @type {webix.DataCollection}
         */
        value: null,
        /**
         * @constructs
         * @param params
         */
        init: function (params) {
            this._super(params);
            this.value = new webix.DataCollection();
        },
        /**
         * @param id
         */
        setCursor: function (id) {
            this.value.setCursor(id);
        },
        /**
         */
        refreshCursor: function () {
            this.value.refreshCursor();
        },
        /**
         */
        getCursor: function () {
            return this.value.getCursor();
        }
    }
);
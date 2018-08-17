/**
 * Model data_collection_wrapper
 *
 * @class
 * @extends MVC.Model
 */
TangoWebappPlatform.DataCollectionWrapper = MVC.Model.extend(
    /** @lends  DataCollectionWrapper.prototype */
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

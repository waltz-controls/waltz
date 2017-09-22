/**
 * Model data_collection_wrapper
 *
 * @type {DataCollectionWrapper}
 */
TangoWebapp.DataCollectionWrapper = MVC.Model.extend(
    /* @Prototype */
    {
        value: null,
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
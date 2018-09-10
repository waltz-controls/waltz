/**
 *
 * @module Logger
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
(function(){
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
     * @property {String} name
     * @memberof ui.Logger
     * @namespace logger
     */
    var logger = webix.protoUI(
        /** @lends logger.prototype */
        {
            _view: null,
            _limit: 125,
            _ui: function () {
                var top = this;
                return {
                    template: function (obj) {
                        return top._view.render(obj);
                    }
                }
            },
            name: "logger",
            /**
             * @constructor
             * @memberof ui.Toolbar.logger
             */
            $init: function (config) {
                webix.extend(config, this._ui());
                this._view = new View({url: this.defaults.ejs});
            },
            /**
             * @param item
             * @memberof ui.Toolbar.logger
             */
            log: function (item) {
                if (item.type === 'error') item.$css = {"background-color": "lightcoral"};
                item.adjusted = true;
                var id = this.add(item);
                this.moveTop(id);
                while (this.data.count() > this._limit) {
                    this.remove(this.getLastId());
                }
            },
            defaults: {
                type: {
                    height: Infinity
                },
                ejs: 'views/main_log_item.ejs'
            }
        }, webix.IdSpace, webix.ui.list);

    /**
     *
     * @param {string} id
     */
    TangoWebapp.ui.newLogger = function(id){
        return webix.extend({
            view:'logger'
        }, {
            id: id
        });
    }
})();

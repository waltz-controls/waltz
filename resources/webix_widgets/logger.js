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
    const logger = webix.protoUI(
        {
            _ui: function () {
                return {
                    template(obj){
                        return `<div class='${obj.type}'>${TangoWebappPlatform.consts.LOG_DATE_FORMATTER(new Date(obj.timestamp))}: ${obj.value}</div>`;
                    }
                }
            },
            name: "logger",
            /**
             * @constructor
             * @memberof ui.Logger.logger.prototype
             */
            $init: function (config) {
                webix.extend(config, this._ui());
            },
            /**
             * @param item
             * @memberof ui.Logger.logger.prototype
             */
            log: function (item) {
                if (item.type === 'error') item.$css = {"background-color": "lightcoral"};
                item.adjusted = true;
                this.addFirst(item);
            },
            defaults: {
                type: {
                    height: Infinity
                }
            }
        }, webix.ui.list, TangoWebappPlatform.mixin.BoundedReverseList);

    /**
     *
     * @param {string} id
     * @memberof ui.Logger
     */
    TangoWebapp.ui.newLogger = function(id){
        return webix.extend({
            view:'logger'
        }, {
            id: id
        });
    }
})();

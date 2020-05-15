/**
 * Extends {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
 * @property {String} name
 * @memberof ui.Logger
 * @namespace logger
 */
import {BoundedReverseList} from "@waltz-controls/waltz-webix-extensions";

const logger = webix.protoUI(
    {
        _ui: function () {
            return {
                template(obj){
                    return `<div class='${obj.type}'>${new Date(obj.timestamp)}: ${obj.value}</div>`;
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
    }, webix.ui.list, BoundedReverseList);

export default function newLogger(id){
    return {
        id,
        view:'logger'
    }
}
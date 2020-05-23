import {kMargins} from "./plot.js";
import {newToolbar, Runnable} from "@waltz-controls/waltz-webix-extensions";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/25/19
 */
/**
 * Extends {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
 * @property {String} name
 * @memberof ui.Plot
 * @namespace spectrum_text
 */
var spectrum_text = webix.protoUI(
    /** @lends spectrum_text*/
    {
        name: 'spectrum_text',
        /**
         * @memberof ui.Plot.spectrum_text
         */
        update: function (data) {
            this.clearAll();
            this.parse(data.value);
        }
    }, webix.ui.list);

/**
 * @property {String} name
 * @extends webix.ui.view
 * @memberof ui.Plot
 * @namespace spectrum
 */
var spectrum = webix.protoUI(
    /** @lends spectrum_plot*/
    {
        name: 'spectrum',
        /**
         * @memberof ui.Plot.spectrum_plot
         */
        update: function (data) {
            var layout = {
                title: "Data acquired @ " + new Date(data.timestamp),
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: kMargins
            };

            Plotly.update(this.getNode(), {y: [data.value]}, layout)
        },
        /**
         * @constructor
         * @memberof ui.Plot.spectrum_plot
         */
        $init: function (config) {
            // webix.extend(config, this._ui(config));
            this.$ready.push(function () {
                try {
                    Plotly.newPlot(this.getNode(), [{
                        y: [],
                        // line: {shape: 'spline'},
                        type: 'bar'
                    }]);
                } catch (e) {
                    throw new Error("Failed to initialize Plotly:" + e.message);
                }
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.view);

const spectrum_view = webix.protoUI({
    name: "spectrum_view",
    _ui(config){
        return {
            rows:[
                (config.info.data_type === 'DevString') ?
                    webix.extend({
                        view: "spectrum_text",
                        id: 'plot'
                    }, config) :
                    webix.extend({
                        view: "spectrum",
                        gravity: 3,
                        id: 'plot'
                    }, config),
                newToolbar()
            ]
        };
    },
    get plot(){
        return this.$$('plot');
    },
    async run(){
        this.config.root.read();
    },
    $init(config){
        webix.extend(config, this._ui(config.root.attribute));
    }
}, Runnable, webix.IdSpace, webix.ui.layout);

import {margins} from "./plot.js";
import newToolbar from "./attrs_monitor_toolbar.js"

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
 * @namespace spectrum_plot
 */
var spectrum_plot = webix.protoUI(
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
                margin: margins
            };

            Plotly.relayout(this.getNode(), layout);
            Plotly.restyle(this.getNode(), 'y', [data.value]);
        },
        /**
         * @constructor
         * @memberof ui.Plot.spectrum_plot
         */
        $init: function (config) {
            // webix.extend(config, this._ui(config));
            this.$ready.push(function () {
                Plotly.newPlot(this.getNode(), [{
                    y: [],
                    // line: {shape: 'spline'},
                    type: 'scatter'
                }]);
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.view);

/**
 * @param {TangoAttribute} config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newSpectrum = function (config) {
    if (config.info.data_type === 'DevString') {
        return webix.extend({
            view: "spectrum_text"
        }, config);
    }
    else {
        return webix.extend({
            view: "spectrum"
        }, config);
    }
};

const spectrum_view = webix.protoUI({
    name: "spectrum_view",
    _ui(config){
        return {
            rows:[
                webix.extend({
                    view: "spectrum",
                    gravity: 3,
                    id:'plot'
                },config),
                newToolbar()
            ]
        };
    },
    get plot(){
        return this.$$('plot');
    },
    async run(){
        const resp = await this.config.read();
        this.plot.update(resp);
    },
    $init(config){
        webix.extend(config, this._ui(config));
    }
}, TangoWebappPlatform.mixin.Runnable, webix.IdSpace, webix.ui.layout);

/**
 * @param {TangoAttribute} config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newSpectrumView = function (config) {
    if (config.info.data_type === 'DevString') {
        return webix.extend({
            view: "spectrum_text"
        }, config);
    }
    else {
        return webix.extend({
            view: "spectrum_view"
        }, config);
    }
};
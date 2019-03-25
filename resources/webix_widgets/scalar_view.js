import {margins} from "./plot.js"

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/25/19
 */
/**
 * @class [scalar_plot]
 * @property {String} name
 * @extends webix.ui.view
 * @memberof ui.Plot
 * @namespace scalar_plot
 */
var scalar = webix.protoUI(
    /** @lends scalar_plot*/
    {
        name: 'scalar',
        _traces: null,
        _relayout: function (layout) {
            Plotly.relayout(this.getNode(), layout);
        },
        /**
         * @param trace name
         * @param {[]} x timestamps
         * @param {[]} y values
         * @param {int} ndx
         * @memberof ui.Plot.scalar_plot
         */
        addTrace: function (trace, x, y, ndx) {
            Plotly.addTraces(this.getNode(), {
                x: x.map(function (time) {
                    return new Date(time);
                }),
                y: y,
                name: trace
            }, ndx);
            this._traces[ndx] = trace;
            this._relayout({
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: margins
            });
        },
        /**
         * @param {int} ndx same as used in addTrace
         * @memberof ui.Plot.scalar_plot
         */
        deleteTrace: function (ndx) {
            Plotly.deleteTraces(this.getNode(), [ndx]);
            this._traces.splice(ndx,1);
            this._relayout({
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: margins
            });
        },
        /**
         * @param {[]} traces an array of traces indices
         * @param {[]} times
         * @param {[]} data an array of data arrays
         * @memberof ui.Plot.scalar_plot
         */
        updateTraces: function (traces, times, data) {
            Plotly.extendTraces(this.getNode(), {
                x: times.map(function (time) {
                    return [new Date(time)];
                }),
                y: data.map(function (data) {
                    return [data];
                })
            }, traces);
            //TODO check if required
            this._relayout({
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: margins
            });
        },
        /**
         * Updates this plot with single data item
         * @param {{timestamp: int, value: data}} data
         * @memberof ui.Plot.scalar_plot
         */
        update: function (data) {
            this.updateMulti([data]);
        },
        /**
         * Updates this plot with multiple data items
         * @param {[{timestamp: int, value: data}]} data
         * @memberof ui.Plot.scalar_plot
         */
        updateMulti:function(data){
            Plotly.extendTraces(this.getNode(), {
                x: [data.map(function(el){ return new Date(el.timestamp)})],
                y: [data.map(function(el){ return el.value;})]
            }, [0]);
            //TODO check if required
            this._relayout({
                title: "Data acquired @ " + new Date(data.pop().timestamp),
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: margins
            });
        },
        /**
         * @memberof ui.Plot.scalar_plot
         */
        clear:function(){
            Plotly.deleteTraces(this.getNode(), this._traces.map(function(el, ndx){ return ndx;}));
            this._traces.forEach(function(trace){
                Plotly.addTraces(this.getNode(), {
                    x: [],
                    y: [],
                    name : trace
                });
            }.bind(this));
            Plotly.relayout(this.getNode(),
                {
                    title: ""
                });
        },
        _newPlot: function (config) {
            this._traces = [];
            Plotly.newPlot(this.getNode(), [], {
                width: this.$width,
                height: this.$height,
                showlegend: true
            });
        },
        /**
         * @memberof ui.Plot.scalar_plot
         * @constructor
         */
        $init: function (config) {
            // webix.extend(config, this._ui(config));
            this.$ready.push(this._newPlot.bind(this, config));
            this.$ready.push(function () {
                if (!config.empty) {
                    this.addTrace(config.name, [], [], 0);
                    this.update(config);
                }
            }.bind(this));
            this.$ready.push(function () {
                var self = this;
                var node = this.getNode();
                webix.ui({
                    view: "contextmenu",
                    data: [
                        "Clear"
                    ],
                    master: node, //  ID of a DIV container
                    on: {
                        onItemClick: function (id) {
                            self.clear();
                        }
                    }
                });
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.view);

/**
 * @param {TangoAttribute} config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newScalarView = function(config) {
    return webix.extend({
        view: "scalar"
    }, config);
};

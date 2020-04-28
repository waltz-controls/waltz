import {kMargins} from "./plot.js"
import newToolbar from "./newToolbar";
import {Runnable} from "views/mixins";

export const btnClearAll = {
    view:"button",
    value:"Clear all",
    maxWidth:120,
    click(){
        this.getTopParentView().clearAll();
    }
};

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/25/19
 */
/**
 * Extends {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
 * @property {String} name
 * @memberof ui.Plot
 * @namespace scalar_text
 */
const scalar_text = webix.protoUI(
    /** @lends spectrum_text*/
    {
        name: 'scalar_text',
        /**
         * @param {TangoAttribute} data
         * @memberof ui.Plot.spectrum_text
         */
        update: function (data) {
            this.add({value: data.value, timestamp: data.timestamp}, 0);
        },
        defaults: {
            template: `
                   <span class="webix_strong">Updated: </span>{common.date()}<br>
                   <span class="webix_strong">Data: </span>#value#`,
            type: {
                height: "auto",
                date(obj) {
                    return new Date(obj.timestamp);
                }
            }
        }
    }, webix.ui.list);

/**
 * @class [scalar]
 * @property {String} name
 * @extends webix.ui.view
 * @memberof ui.Plot
 * @namespace scalar
 */
const scalar = webix.protoUI(
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
                margin: kMargins
            });
        },
        /**
         * @param {Array<string>} traces names
         * @param {[]} x timestamps
         * @param {[]} y values
         * @memberof ui.Plot.scalar_plot
         */
        addTraces: function (traces, x, y) {
            Plotly.addTraces(this.getNode(),
                traces.map((trace, index) => {
                    return {
                        x: x[index].map(function (time) {
                            return new Date(time);
                        }),
                        y: y[index],
                        name: trace
                    }
                }));

            this._traces.push(...traces);
            this._relayout({
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: kMargins
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
                margin: kMargins
            });
        },
        /**
         * @param {[]} traces an array of traces indices
         * @param {[]} times
         * @param {[]} data an array of data arrays
         * @memberof ui.Plot.scalar_plot
         */
        updateTraces: function (traces, times, data) {
            const layout = {
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: kMargins
            };
            Plotly.extendTraces(this.getNode(), {
                x: times.map(function (time) {
                    return [new Date(time)];
                }),
                y: data.map(function (data) {
                    return [data];
                })
            }, traces);
            this._relayout(layout);
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
            const last = data.pop();
            this._relayout({
                title: `${last.value} @ ${new Date(last.timestamp)}`,
                autosize: false,
                width: this.$width,
                height: this.$height,
                margin: kMargins
            });
        },
        /**
         * @memberof ui.Plot.scalar_plot
         */
        clearAll:function(){
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
            try {
                Plotly.newPlot(this.getNode(), [], {
                    type: 'scattergl',
                    mode: 'lines',
                    width: this.$width,
                    height: this.$height,
                    showlegend: true
                });
            }catch(e){
                TangoWebappHelpers.error("Failed to initialize Plotly", e)
            }
        },
        /**
         * @memberof ui.Plot.scalar_plot
         * @constructor
         */
        $init: function (config) {
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
                            self.clearAll();
                        }
                    }
                });
            }.bind(this));
            this.$ready.push(() => {
                const node = this.getNode();
                node.on('plotly_legendclick', (eventData) => {
                    this.getTopParentView().callEvent("onPlotlyLegendClick", [eventData.curveNumber]);
                });
            });
        }
    }, webix.IdSpace, webix.ui.view);




const btnHistory = {
    view:"button",
    value:"History",
    maxWidth:120,
    click(){
        this.getTopParentView().readHistory();
    }
};

const scalar_view = webix.protoUI({
    name: "scalar_view",
    _ui(config){
        const rows = [];
        const view = config.info.data_type === 'DevString' ||
                    config.info.data_type === 'State' ? "scalar_text" : "scalar";

        rows.push(webix.extend({
            view: view,
            id: 'plot'
        }, config.attributes()));

        if(config.info.writable.includes('WRITE')){
            rows.push({view:"resizer"});
            rows.push(webix.extend({view:"scalar_input"},{attr:config}));
        }


        rows.push(newToolbar([btnHistory,btnClearAll]));

        return {
            rows
        }
    },
    clearAll(){
        this.plot.clearAll();
    },
    readHistory(){
        this.config.fetchHistory()
            .then(() => {
                this.plot.updateMulti(this.config.history);
            });
    },
    get plot(){
        return this.$$('plot');
    },
    async run(){
        const resp = await this.config.read();
        this.plot.update(resp.attributes());
    },
    $init(config){
        webix.extend(config, this._ui(config));
    }
}, Runnable ,  webix.IdSpace, webix.ui.layout);

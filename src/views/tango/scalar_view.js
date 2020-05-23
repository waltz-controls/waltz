import {kMargins} from "./plot.js"
import {newToolbar, Runnable} from "@waltz-controls/waltz-webix-extensions";

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
        _config(){
            return {
                type: {
                    height: "auto",
                    template(obj){
                        return `<span class="webix_strong">${obj.value}</span>@${obj.timestamp} [${new Date(obj.timestamp)}]`
                    }
                }
            }
        },
        /**
         * @param {TangoAttribute} data
         * @memberof ui.Plot.spectrum_text
         */
        update: function (data) {
            this.add(data, 0);
        },
        $init(config){
            webix.extend(config, this._config());
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
        _newPlot: function () {
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
                throw new Error("Failed to initialize Plotly", e)
            }
        },
        /**
         * @memberof ui.Plot.scalar_plot
         * @constructor
         */
        $init: function (config) {
            this.$ready.push(this._newPlot.bind(this));
            this.$ready.push(function () {
                if (!config.empty) {
                    this.addTrace(config.attr.name, [], [], 0);
                    this.update(config.attr);
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
        this.config.root.readHistory();
    }
};

const scalar_view = webix.protoUI({
    name: "scalar_view",
    /**
     *
     * @param {TangoAttribute} config
     * @return {{rows: []}}
     * @private
     */
    _ui(config){
        const attr = config.root.attribute;
        const rows = [];
        const view = (attr.info.data_type === 'DevString' || attr.info.data_type === 'State') ?
            "scalar_text" :
            "scalar";

        rows.push({
            view: view,
            id: 'plot',
            attr
        });

        if(attr.writable){
            rows.push({view:"resizer"});
            rows.push({view:"scalar_input",attr, root: config.root});
        }


        rows.push(newToolbar([webix.extend(btnHistory,config),btnClearAll]));

        return {
            rows
        }
    },
    clearAll(){
        this.plot.clearAll();
    },
    get plot(){
        return this.$$('plot');
    },
    async run(){
        this.config.root.read();
    },
    $init(config){
        webix.extend(config, this._ui(config));
    }
}, Runnable ,  webix.IdSpace, webix.ui.layout);

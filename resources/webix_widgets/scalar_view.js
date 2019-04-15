import {kMargins} from "./plot.js"
import newToolbar from "./attrs_monitor_toolbar.js";

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
                margin: kMargins
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
        }
    }, webix.IdSpace, webix.ui.view);

const btnMinus = {view:"button",value:"-", tooltip:"Hotkey: Ctrl + numpad(-)", hotkey: "ctrl+109", width: 20, click(){ this.getFormView()._write_minus()}};
const btnPlus = {view:"button",value:"+", tooltip:"Hotkey: Ctrl + numpad(+)", hotkey: "ctrl+107", width: 20, click(){ this.getFormView()._write_plus()}};
const btnWrite = {view:"button", maxWidth:120, value:"Write", tooltip:"Hotkey: Enter", hotkey: "enter",click(){this.getFormView()._write() }};

const scalar_input = webix.protoUI({
    name:"scalar_input",
    getValue(){
        const value = this.elements.value.getValue();
        switch(this.config.attr.info.data_type){
            case "DevShort":
            case "DevUShort":
            case "DevLong":
            case "DevULong":
            case "DevLong64":
            case "DevULong64":
                return parseInt(value);
            case "DevDouble":
            case "DevFloat":
                return parseFloat(value);
            case "DevString":
            case "DevChar":
            case "DevUChar":
            default:
                return value;
        }
    },
    setValue(value){
        this.elements.value.setValue(value);
    },
    _write_minus(){
        if(!this.validate()) return;
        const delta = this.getValue();
        this.config.attr.read().then(resp => {
            UserAction.writeAttribute(this.config.attr,resp.value - delta)
                .then(()=>{
                    this.getTopParentView().run();
                });
        })
    },
    _write_plus(){
        if(!this.validate()) return;
        const delta = this.getValue();
        this.config.attr.read().then(resp => {
            UserAction.writeAttribute(this.config.attr,resp.value + delta)
                .then(()=>{
                    this.getTopParentView().run();
                });
        })
    },
    _write(){
        if(!this.validate()) return;
        UserAction.writeAttribute(this.config.attr,this.getValues().value)
            .then(()=>{
                this.getTopParentView().run();
            });
    },
    _compact_view(attr){
        const cols = [
            {view:"text", name:"value", placeholder: `Input: ${attr.info.data_type} [min:${attr.info.min_value};max:${attr.info.max_value}]`, gravity:2}
        ];

        if(attr.info.data_format === "SCALAR")
            cols.push(btnMinus, btnPlus);

        cols.push(btnWrite);

        return {
            cols
        }
    },
    _normal_view(attr){
        const cols = [
            {}
        ];

        if(attr.info.data_format === "SCALAR")
            cols.push(btnMinus, btnPlus);

        cols.push(btnWrite);

        return {
            elements:[
                {view:"text", name:"value", label:`Input: ${attr.info.data_type} [min:${attr.info.min_value};max:${attr.info.max_value}]`, labelPosition: "top", placeholder: attr.info.format, tooltip:attr.info.description, validate:webix.rules.isNotEmpty},
                {
                    cols
                }
            ]
        }
    },
    _config(config){
        let body;
        if(config.type && config.type === "compact"){
            body = this._compact_view(config.attr)
        } else {
            body = this._normal_view(config.attr)
        }
        return body;
    },
    $init(config){
        webix.extend(config, this._config(config));
    }

}, webix.IdSpace,webix.ui.form);

const btnHistory = {
    view:"button",
    value:"History",
    maxWidth:120,
    click(){
        this.getTopParentView().readHistory();
    }
};

/**
 * @param {TangoAttribute} config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newScalar = function(config) {
    return webix.extend({
        view: "scalar"
    }, config);
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
        UserAction.readAttributeHistory(this.config)
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
}, TangoWebappPlatform.mixin.Runnable ,  webix.IdSpace, webix.ui.layout);

/**
 * @param {TangoAttribute} config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newScalarView = function(config) {
    webix.assert(!config.empty, "Config can not be empty for newScalarView");
    return webix.extend({
        view: "scalar_view"
    }, config);
};

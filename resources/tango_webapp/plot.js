/** @module Plot */
(function () {
    var margins = {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
    };

    /**
     * @type {webix.protoUI}
     */
    var image_plot = webix.protoUI({
        value: "",
        name: "image",
        /**
         *
         * @param {data:[], width:int, height:int} value
         */
        update: function (resp) {
            var data = [];
            for (var i = 0, j = 0; i < resp.value.height; ++i, j += resp.value.width) {
                data.push(resp.value.data.slice(j, j + resp.value.width))
            }

            var ratio = resp.value.width / resp.value.height;
            var height = Math.max(this.$height, Math.min(this.$height, resp.value.height));
            var layout = {
                title: "Data acquired @ " + new Date(resp.timestamp),
                autosize: false,
                width: height * ratio,//assume square
                height: height,
                margin: margins
            };

            Plotly.relayout(this.getNode(), layout);
            Plotly.restyle(this.getNode(), 'z', [data]);
        },
        $init: function (config) {
            this.$ready.push(function () {
                Plotly.newPlot(this.getNode(), [{
                    z: [],
                    type: 'heatmap'
                }]);
            });
        }
    }, webix.IdSpace, webix.ui.view);

    TangoWebapp.ui.newImageView = function (config) {
        return webix.extend({
            view: "image"
        }, config);
    };

    /**
     * @type {webix.protoUI}
     */
    var scalar_plot = webix.protoUI(
        {
            name: 'scalar',
            _traces: null,
            _relayout: function (layout) {
                Plotly.relayout(this.getNode(), layout);
            },
            /**
             *
             * @param trace name
             * @param {[]} x timestamps
             * @param {[]} y values
             * @param {int} ndx
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
             *
             * @param {int} ndx same as used in addTrace
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
             *
             * @param {[]} traces an array of traces indices
             * @param {[]} times
             * @param {[]} data an array of data arrays
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
             *
             * @param {{timestamp: int, value: data}} data
             */
            update: function (data) {
                var date = new Date(data.timestamp);
                Plotly.extendTraces(this.getNode(), {
                    x: [[date]],
                    y: [[data.value]]
                }, [0]);
                //TODO check if required
                this._relayout({
                    title: "Data acquired @ " + date,
                    autosize: false,
                    width: this.$width,
                    height: this.$height,
                    margin: margins
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
                        id: config.id + "_menu",
                        data: [
                            "Clear"
                        ],
                        master: node, //  ID of a DIV container
                        on: {
                            onItemClick: function (id) {
                                Plotly.deleteTraces(node, self._traces.map(function(el, ndx){ return ndx;}));
                                self._traces.forEach(function(trace){
                                    Plotly.addTraces(node, {
                                        x: [],
                                        y: [],
                                        name : trace
                                    });
                                });
                                Plotly.relayout(node,
                                    {
                                        title: ""
                                    });
                            }
                        }
                    });
                }.bind(this));
            }
        }, webix.IdSpace, webix.ui.view);

    /**
     *
     * @param {TangoAttribute} config
     */
    TangoWebapp.ui.newScalarView = function (config) {
        return webix.extend({
            view: "scalar"
        }, config);
    };

    /**
     * @type {webix.protoUI}
     */
    var spectrum_text = webix.protoUI({
        name: 'spectrum_text',
        update: function (data) {
            this.clearAll();
            this.parse(data.value);
        }
    }, webix.ui.list);

    /**
     * @type {webix.protoUI}
     */
    var spectrum_plot = webix.protoUI(
        {
            name: 'spectrum',
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
     *
     * @param {TangoAttribute} config
     */
    TangoWebapp.ui.newSpectrumView = function (config) {
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
})();
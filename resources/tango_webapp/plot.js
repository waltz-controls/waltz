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
            update: function (data) {
                var layout = {
                    title: "Data acquired @ " + new Date(data.timestamp),
                    autosize: false,
                    width: this.$width,
                    height: this.$height,
                    margin: margins
                };


                // Plotly.restyle(this.getNode(), 'y', [data]);

                Plotly.extendTraces(this.getNode(), {
                    x: [[new Date(data.timestamp)]],
                    y: [[data.value]]
                }, [0]);
                Plotly.relayout(this.getNode(), layout);
            },
            $init: function (config) {
                // webix.extend(config, this._ui(config));
                this.$ready.push(function () {
                    Plotly.newPlot(this.getNode(), [{
                        x: [],
                        y: [],
                        line: {shape: 'spline'},
                        type: 'scatter'
                    }]);
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
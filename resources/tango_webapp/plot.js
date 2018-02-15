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
        update: function (value) {
            var data = [];
            for (var i = 0, j = 0; i < value.height; ++i, j += value.width) {
                data.push(value.data.slice(j, j + value.width))
            }

            var ratio = value.width / value.height;
            var height = Math.max(this.$height, Math.min(this.$height, value.height));
            var layout = {
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
                    autosize: false,
                    width: this.$width,
                    height: this.$height,
                    margin: margins
                };


                // Plotly.restyle(this.getNode(), 'y', [data]);

                Plotly.extendTraces(this.getNode(), {
                    y: [[data]]
                }, [0]);
                Plotly.relayout(this.getNode(), layout);
            },
            $init: function (config) {
                // webix.extend(config, this._ui(config));
                this.$ready.push(function () {
                    Plotly.newPlot(this.getNode(), [{
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
            this.parse(data);
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
                    autosize: false,
                    width: this.$width,
                    height: this.$height,
                    margin: margins
                };

                Plotly.relayout(this.getNode(), layout);
                Plotly.restyle(this.getNode(), 'y', [data]);
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
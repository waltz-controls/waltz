/** @module ScalarPlot */
(function () {
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
                    margin: {
                        l: 50,
                        r: 50,
                        b: 50,
                        t: 50,
                        pad: 4
                    }
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

})();
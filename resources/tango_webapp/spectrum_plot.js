/** @module SpectrumPlot */
(function () {
    /**
     * @type {webix.protoUI}
     */
    var spectrum_plot = webix.protoUI(
        {
            name: 'spectrum',
            update: function (data) {
                var plot = {
                    y: data,
                    x: data.map(function (it, ndx) {
                        return ndx;
                    }),
                    // line: {shape: 'spline'},
                    type: 'scatter'
                };

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

                Plotly.newPlot(this.getNode(), [plot], layout);
            },
            $init: function (config) {
                // webix.extend(config, this._ui(config));
                // this.$ready.push(this.update.bind(this, config.value));
            },
            defaults: {
                template: '<div/>'
            }
        }, webix.IdSpace, webix.ui.template);

    TangoWebapp.ui.newSpectrumView = function (config) {
        return webix.extend({
            view: "spectrum"
        }, config);
    };
})();

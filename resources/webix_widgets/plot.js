/**
 * @constant
 * @memberof ui.Plot
 */
export const margins = {
    l: 50,
    r: 50,
    b: 50,
    t: 50,
    pad: 4
};

/** @module Plot
 *  @memberof ui
 */
(function () {
    /**
     * @extends webix.ui.view
     * @property {String} name
     * @property {String} value
     * @memberof ui.Plot
     * @namespace image_plot
     */
    var image_plot = webix.protoUI(
        /** @lends image_plot*/
        {
        value: "",
        name: "image",
        /**
         * @memberof ui.Plot.image_plot
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
        /**
         * @memberof ui.Plot.image_plot
         * @constructor
         */
        $init: function (config) {
            this.$ready.push(function () {
                Plotly.newPlot(this.getNode(), [{
                    z: [],
                    type: 'heatmap'
                }]);
            });
        }
    }, webix.IdSpace, webix.ui.view);
    /**
     * @param config
     * @memberof ui.Plot
     */
    TangoWebapp.ui.newImageView = function (config) {
        return webix.extend({
            view: "image"
        }, config);
    };



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
/** @module ImagePlot */
(function () {
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

            var height = Math.max(value.height, this.$height);
            var layout = {
                autosize: false,
                width: Math.max(value.width, height),//assume square
                height: height,
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50,
                    pad: 4
                }
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
})();

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
            var data = [{
                z: [],
                type: 'heatmap'
            }];

            var layout = {
                autosize: false,
                width: value.width < TangoWebapp.consts.PLOTLY_SCALE_THRESHOLD ? value.width*2 : value.width,
                height: value.height < TangoWebapp.consts.PLOTLY_SCALE_THRESHOLD ? value.height*2 : value.height,
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50,
                    pad: 4
                }
            };

            for(var i = 0, j = 0; i < value.height; ++i, j += value.width){
                data[0].z.push(value.data.slice(j, j + value.width))
            }

            Plotly.newPlot(this.getNode(), data, layout);
        },
        $init: function (config) {
            this.$ready.push(this.update.bind(this, config.value));
        },
        defaults: {
            template: "<div />"
        }
    }, webix.IdSpace, webix.ui.template);

    TangoWebapp.ui.newImageView = function (config) {
        return webix.extend({
            view: "image"
        }, config);
    };
})();

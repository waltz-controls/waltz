import {margins} from "./plot.js"
import newToolbar from "./attrs_monitor_toolbar.js";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/25/19
 */
/**
 * @extends webix.ui.view
 * @property {String} name
 * @property {String} value
 * @memberof ui.Plot
 * @namespace image_plot
 */
var image = webix.protoUI(
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
TangoWebapp.ui.newImage = function (config) {
    return webix.extend({
        view: "image"
    }, config);
};

const image_view = webix.protoUI({
    name: "image_view",
    _ui(config){
        return {
            rows:[
                webix.extend({
                    view: "image",
                    gravity: 3,
                    id:'plot'
                },config),
                newToolbar()
            ]
        };
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
}, TangoWebappPlatform.mixin.Runnable, webix.IdSpace, webix.ui.layout);

/**
 * @param config
 * @memberof ui.Plot
 */
TangoWebapp.ui.newImageView = function (config) {
    return webix.extend({
        view: "image_view"
    }, config);
};
webix.protoUI(
    {
        name: 'Spectrum',
        getChart: function (config) {
            return {
                    id: 'chart',
                    type: "line",
                    value: "#value#",
                    color: "#f6960a",
                    border: true,
                    xAxis: {
                        template: "#id#"
                    },
                    legend: {
                        width: 250,
                        values: [{text: config.name, color: "#f6960a"}],
                        align: 'center'
                    }
            }
        },
        $init: function (config) {
            webix.extend(config, this.getChart(config));
            this._data = config.data.map(function (el, ndx, value) {
                return {id: ndx, value: el};
            });
            this.$ready.push(function () {
                this.$$('chart').parse(this._data);
                //this.$$('chart').refresh();

            });
        },
        defaults: {

        }
    }, webix.IdSpace, webix.ui.chart);

TangoWebapp.ui.newSpectrumView = function(config){
    return webix.extend({
        view:"Spectrum"
    }, config);
};
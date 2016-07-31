webix.protoUI(
    {
        name: 'Spectrum',
        update: function (data) {
            this.clearAll();
            this.parse(data.map(function (el, ndx, value) {
                return {ndx: ndx, data: el, color: "#f6960a"};
            }));
            //this.refresh();
        },
        getChart: function (config) {
            return {
                legend: {
                    width: 250,
                    values: [{text: config.name, color: "#f6960a"}],
                    align: 'center'
                }
            }
        },
        $init: function (config) {
            webix.extend(config, this.getChart(config));
            this.$ready.push(function () {
                this.update(config.value);
            });
        },
        defaults: {
            type: "line",
            value: "#data#",
            color: "#f6960a",
            border: true,
            xAxis: {
                template: "#ndx#",
                property: "value"
            },
            YAxis: {
                template: function (obj) {
                    return (obj % 20 ? "" : obj)
                },
                property: "value"
            }
        }
    }, webix.IdSpace, webix.ui.chart);

TangoWebapp.ui.newSpectrumView = function (config) {
    return webix.extend({
        view: "Spectrum"
    }, config);
};
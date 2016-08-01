webix.protoUI(
    {
        _getUI: function (config) {
            return {
                rows: [
                    {
                        view: "chart",
                        type: "line",
                        id: "chart",
                        value: "#value#",
                        color: "#f6960a",
                        border: true,
                        tooltip: {
                            template: "#value#"
                        },
                        xAxis: {
                            titel: "Index",
                            template: "#ndx#"
                        },
                        YAxis: {
                            titel: "Value",
                            template: function (obj) {
                                return (obj % 20 ? "" : obj)
                            }
                        },
                        legend: {
                            width: 250,
                            values: [{text: config.name, color: "#f6960a"}],
                            align: 'center'
                        }
                    }]
            };
        },
        name: 'Spectrum',
        update: function (data) {
            var $$chart = this.$$("chart");
            $$chart.clearAll();
            $$chart.parse(data.map(function (el, ndx, value) {
                return {ndx: ndx, value: el, color: "#f6960a"};
            }));
            $$chart.refresh();
        },
        $init: function (config) {
            webix.extend(config, this._getUI(config));
            this.$ready.push(this.update.bind(this,config.value));
        },
        defaults: {}
    }, webix.IdSpace, webix.ui.layout);

TangoWebapp.ui.newSpectrumView = function (config) {
    return webix.extend({
        view: "Spectrum"
    }, config);
};
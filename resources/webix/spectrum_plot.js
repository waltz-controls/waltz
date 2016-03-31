webix.protoUI(
    {
        name: 'Plot',
        getChart: function (config) {
            return {
                body: {
                    view: 'chart',
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
            }
        },
        $init: function (config) {
            webix.extend(config, this.getChart(config));
            this.$ready.push(function () {
                this.getHead().setValues({name: config.name});
            });
            this._data = config.data.map(function (el, ndx, value) {
                return {id: ndx, value: el};
            });
            this.$ready.push(function () {
                this.$$('chart').parse(this._data);
                //this.$$('chart').refresh();

            });
        },
        defaults: {
            move: true,
            head: {template: 'Plot attribute [#name#]'},
            width: 1024,
            height: 480
        }
    }, webix.IdSpace, webix.ui.window);
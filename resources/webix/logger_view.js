webix.protoUI({
    _view: null,
    _getUI: function () {
        var top = this;
        return {
            template: function (obj) {
                return top._view.render(obj);
            }
        }
    },
    name: "LogOutput",
    $init: function (config) {
        webix.extend(config, this._getUI());

        this._view = new View({url: config.ejs});
    }


}, webix.IdSpace, webix.ui.list);
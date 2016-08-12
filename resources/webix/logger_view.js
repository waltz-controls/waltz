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
    name: "Logger",
    $init: function (config) {
        webix.extend(config, this._getUI());

        this._view = new View({url: config.ejs});
    },
    log: function(item){
        var id = this.add(item);
        this.moveTop(id);
        //TODO background-color
    }


}, webix.IdSpace, webix.ui.list);
webix.protoUI({
    _view: null,
    _limit: 125,
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
        if(item.type === 'error') item.$css = {"background-color" : "lightcoral"};
        item.adjusted = true;
        var id = this.add(item);
        this.moveTop(id);
        while(this.data.count() > this._limit){
            this.remove(this.getLastId());
        }
    },
    defaults:{
        type:{
            height: Infinity
        }
    }
}, webix.IdSpace, webix.ui.list);
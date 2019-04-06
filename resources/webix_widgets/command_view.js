import newToolbar from "./attrs_monitor_toolbar.js";

const command_output = webix.protoUI(
    /** @lends spectrum_text*/
    {
        name: 'command_output',
        /**
         * @memberof ui.Plot.spectrum_text
         */
        update: function (resp) {
            if(!resp) return;
            this.clearAll();
            this.parse(resp.output);//TODO
        }
    }, webix.ui.list);

const command_input = webix.protoUI({
    name: 'command_input',
    _config(){
        return {
            elements:[

            ]
        }
    },
    $init(config){
        webix.extend(config, this._config())
    }
},webix.ui.form);

const command_view = webix.protoUI({
    name: 'command_view',
    clearAll(){
        this.plot.clearAll();
    },
    execute(){
        debugger
    },
    _ui(){
        return {
            rows:[
                {
                    view: 'command_output',
                    id:'output',
                },
                {
                    view: 'command_input',
                    id: 'input'
                },
                newToolbar([{
                    view:"button",
                    value:"Execute",
                    maxWidth:120,
                    click(){
                        this.getTopParentView().execute();
                    }
                },{
                    view:"button",
                    value:"Clear all",
                    maxWidth:120,
                    click(){
                        this.getTopParentView().clearAll();
                    }
                }])
            ]
        }
    },
    get plot(){
        return this.$$('output');
    },
    $init(config){
        webix.extend(config, this._ui());
    }
},webix.IdSpace,webix.ui.layout);

TangoWebapp.ui.newCommandView = function(config){
    return webix.extend({
        view: "command_view"
    }, config)
};
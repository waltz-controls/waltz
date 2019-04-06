import newToolbar from "./attrs_monitor_toolbar.js";
import {codemirror_textarea} from "./scripting_console.js";

const pipe_output = webix.protoUI({
    name: "pipe_output",
    update(value){
        if(!value) return;
        this.setValue(JSON.stringify({
            name: value.name,
            size: value.size,
            timestamp: value.timestamp,
            data: value.data
        }));
        const totalLines = this.editor.lineCount();
        this.editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
    }
},codemirror_textarea);

const pipe_view = webix.protoUI({
    name: "pipe_view",
    get plot(){
        return this.$$('output');
    },
    async run(){
        this.plot.update(await this.config.read());
    },
    _ui(){
        return {
            rows:[
                {
                    view: "pipe_output",
                    id: "output",
                    mode: "application/json"
                },
                newToolbar()
            ]
        }
    },
    $init(config){
        webix.extend(config, this._ui())
    }
},TangoWebappPlatform.mixin.Runnable,webix.IdSpace,webix.ui.layout);

TangoWebapp.ui.newPipeView = function(config){
    return webix.extend({
        view: "pipe_view"
    }, config);
};


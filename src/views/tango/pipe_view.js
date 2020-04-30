import newToolbar from "views/tango/newToolbar";
import codemirror_textarea from "views/codemirror_textarea";
import {Runnable} from "views/mixins";

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
        this.config.root.refresh();
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
},Runnable,webix.IdSpace,webix.ui.layout);


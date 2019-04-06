import newToolbar from "./attrs_monitor_toolbar.js";
import {btnClearAll} from "./scalar_view.js";

const command_output = webix.protoUI(
    /** @lends spectrum_text*/
    {
        name: 'command_output',
        /**
         * @memberof ui.Plot.spectrum_text
         */
        update: function (command) {
            if(!command) return;
            this.add(command,0);
        },
        _config(cmd){
            return {
                type: {
                    height: "auto",
                    template(obj){
                        return `<div>
                                    <div>Command executed: ${+new Date()}</div>
                                    <div>Input: ${obj.input} [${cmd.info.in_type_desc}]</div>
                                    <div>Output: ${obj.output} [${cmd.info.out_type_desc}]</div>
                                </div>`
                    }
                }
            }
        },
        $init(config){
            webix.extend(config, this._config(config.cmd));
        }
    }, webix.ui.list);

const command_input = webix.protoUI({
    name: 'command_input',
    _config(config){
        const argin = {view:"textarea", name:"argin", label:`Input: ${config.info.in_type} [${config.info.in_type_desc}]`, labelPosition: "top", placeholder: "3.14, 'String', ['string','array']"};

        if (config.info.in_type !== 'DevVoid') {
            webix.extend(argin,{
                validate: webix.rules.isNotEmpty,
                invalidMessage: 'Input argument can not be empty'
            });
        } 

        return {
            elements:[
                argin
            ]
        }
    },
    $init(config){
        webix.extend(config, this._config(config.cmd))
    }
},webix.ui.form);

const btnExecute = {
    view:"button",
    value:"Execute",
    maxWidth:120,
    click(){
        this.getTopParentView().execute();
    }
};

const command_view = webix.protoUI({
    name: 'command_view',
    clearAll(){
        this.plot.clearAll();
    },
    execute(){
        if(!this.$$('input').validate()) return;
        const command = this.config;

        const argin = this.$$('input').elements.argin.getValue(); //TODO clever logic here

        UserAction.executeCommand(command, argin)
            .then((resp) => {
                if (!resp.output) resp.output = "";
                webix.extend(resp, {input:argin});
                this.$$('output').update(resp);
            });
    },
    run(){
        this.execute();
    },
    _ui(config){
        return {
            rows:[
                {
                    view: 'command_output',
                    id:'output',
                    cmd: config
                },
                {
                    view:"resizer"
                },
                {
                    view: 'command_input',
                    id: 'input',
                    cmd: config
                },
                newToolbar([btnExecute,btnClearAll])
            ]
        }
    },
    get plot(){
        return this.$$('output');
    },
    $init(config){
        webix.extend(config, this._ui(config));
    }
},TangoWebappPlatform.mixin.Runnable, webix.IdSpace,webix.ui.layout);

TangoWebapp.ui.newCommandView = function(config){
    return webix.extend({
        view: "command_view"
    }, config)
};
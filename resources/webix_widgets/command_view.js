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
                                    <div>Command executed: ${+new Date()} (${new Date()})</div>
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
        const command = this.config;
        let argin;
        if(this.config.info.in_type !== 'DevVoid') {
            const $$input = this.$$('input');
            if (!$$input.validate()) return;

            argin = $$input.elements.argin.getValue(); //TODO clever logic here
        } else {
            argin = undefined;
        }


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
        const rows = [];

        rows.push({
            view: 'command_output',
            id:'output',
            cmd: config
        });

        if (config.info.in_type !== 'DevVoid') {
            rows.push(
                {
                    view:"resizer"
                },
                {
                    view: 'command_input',
                    id: 'input',
                    cmd: config
                });
        }

        rows.push(newToolbar([btnExecute,btnClearAll]));


        return {
            rows
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
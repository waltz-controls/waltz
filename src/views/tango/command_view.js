import newToolbar from "views/tango/newToolbar";
import {btnClearAll} from "views/tango/scalar_view";
import {ExecuteTangoCommand} from "models/user_action";
import {Runnable} from "views/mixins";

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
    getValue(){
        return this.elements.argin.getValue(); //TODO clever logic here
    },
    setValue(value){
        this.elements.argin.setValue(value);
    },
    _normal_view(command){
        const argin = {};
        if (command.info.in_type !== 'DevVoid') {
            webix.extend(argin,{
                view:"textarea",
                name:"argin",
                label:`Input: ${command.info.in_type} [${command.info.in_type_desc}]`,
                labelPosition: "top",
                placeholder: "3.14, 'String', ['string','array']",
                validate: webix.rules.isNotEmpty,
                invalidMessage: 'Input argument can not be empty'
            });
        } else {
            webix.extend(argin,{ hidden: true });
        }

        return argin;
    },
    /**
     *
     * @param {TangoCommand} command
     * @return {{}}
     * @private
     */
    _mini_view(command){
        const argin = {};
        if (command.isVoid()) {
            webix.extend(argin, {hidden: true});
        } else {
            webix.extend(argin, {
                view: "textarea",
                name: "argin",
                placeholder: `Input: ${command.data_type}`,
                tooltip: `Input: ${command.data_type}`,
                validate: webix.rules.isNotEmpty,
                invalidMessage: 'Input argument can not be empty'
            });
        }
        return argin;
    },
    _config(config){
        let argin;

        if(config.type && config.type === "mini"){
            argin = this._mini_view(config.cmd)
        } else {
            argin = this._normal_view(config.cmd);
        }

        return {
            elements:[
                argin
            ]
        }
    },
    $init(config){
        webix.extend(config, this._config(config))
    }
},webix.ui.form);

const btnExecute = {
    view:"button",
    value:"Execute",
    tooltip:"Hotkey: Ctrl + Enter",
    hotkey: "ctrl+enter",
    maxWidth:120,
    click(){
        this.getTopParentView().execute();
    }
};

/**
 *
 * @param {Member} command
 * @param {webix.ui.form} $$input
 */
export function commandExecutionHelper(command, $$input){
    let argin;
    if (command.isVoid()) {
        argin = undefined;
    } else {
        if (!$$input.validate()) return;
        argin = $$input.getValue();
    }
    return new ExecuteTangoCommand({user: PlatformContext.UserContext.user, command: command, value:argin}).submit();
}

const command_view = webix.protoUI({
    name: 'command_view',
    clearAll(){
        this.plot.clearAll();
    },
    execute(){
        const command = this.config;
        const $$input = this.$$('input');
        commandExecutionHelper(command,$$input)
            .then((resp) => {
                if (!resp.output) resp.output = "";
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
},Runnable, webix.IdSpace,webix.ui.layout);

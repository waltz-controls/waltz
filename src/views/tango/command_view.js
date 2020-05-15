import newToolbar from "views/tango/newToolbar";
import {btnClearAll} from "views/tango/scalar_view";
import {Runnable} from "@waltz-controls/waltz-webix-extensions";

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
                                    <div>Input: ${obj.input}</div>
                                    <div>Output: ${obj.output}</div>
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
        if (command.isVoid()) {
            webix.extend(argin, {hidden: true});
        } else {
            webix.extend(argin, {
                view: "textarea",
                name: "argin",
                label: `Input: ${command.info.in_type} `,
                labelPosition: "top",
                placeholder: `3.14, 'String', ['string','array'] [${command.info.in_type_desc}]`,
                tooltip: `3.14, 'String', ['string','array'] [${command.info.in_type_desc}]`,
                validate: webix.rules.isNotEmpty,
                invalidMessage: 'Input argument can not be empty'
            });
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
                placeholder: `Input: ${command.info.in_type} [${command.info.in_type_desc}]`,
                tooltip: `Input: ${command.info.in_type}  [${command.info.in_type_desc}]`,
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
        this.getTopParentView().run();
    }
};

const command_view = webix.protoUI({
    name: 'command_view',
    clearAll(){
        this.plot.clearAll();
    },
    run(){
        const value = this.config.root.command.isVoid() ? undefined : this.input.getValue();
        this.config.root.execute(value);
    },
    _ui(config){
        const rows = [];

        rows.push({
            view: 'command_output',
            id:'output',
            cmd: config.root.command
        });

        if (!config.root.command.isVoid()) {
            rows.push(
                {
                    view:"resizer"
                },
                {
                    view: 'command_input',
                    id: 'input',
                    cmd: config.root.command
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
    get input(){
        return this.$$('input');
    },
    get output(){
        return this.$$('output');
    },
    $init(config){
        webix.extend(config, this._ui(config));
    }
},Runnable, webix.IdSpace,webix.ui.layout);

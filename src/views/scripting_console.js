/**
 * @module ScriptingConsole
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
import UserScript from "models/user_script";

import "views/codemirror_textarea";

/**
 * @constant
 * @memberof ui.ScriptingConsole
 * @namespace upper_toolbar
 */
const upper_toolbar = {
    view: 'toolbar',
    cols: [
        {
            maxWidth: 380,
            view: 'text',
            id: 'script_name',
            name: 'script_name',
            placeholder: 'script name',
            label: 'Script name:',
            labelWidth: 100,
            validate:webix.rules.isNotEmpty,
            invalidMessage:"Script name can not be empty",
            on: {
                /**
                 * Event listener.
                 * @memberof ui.ScriptingConsole.upper_toolbar
                 */
                onBindApply: function (script) {
                    if (!script || script.id === undefined) {
                        this.setValue(''); //reset this value after script removal
                        return false;
                    }
                    this.setValue(script.name);
                },
                /**
                 * Event listener. Work-around [object Object] in this field.
                 * @memberof ui.ScriptingConsole.upper_toolbar
                 */
                onBindRequest:function(){
                    if(typeof this.data.value === 'object')
                        this.data.value = '';
                }
            }
        },
        {
            view: "icon",
            icon: 'wxi-check',
            click: function () {
                this.getTopParentView().save();
            },
            hotkey: 'ctrl+s',
            tooltip: 'Hotkey: ctrl+s'
        },
        {
            view: "icon",
            icon: 'wxi-trash',
            click: function () {
                this.getTopParentView().remove();
            }
        }
    ]
};

/**
 * @constant
 * @memberof ui.ScriptingConsole
 */
const script_code = {
    view: 'fieldset',
    label: 'Script code (JavaScript)',
    body: {
        view: 'codemirror_textarea',
        id: 'script_code',
        on: {
            onBindApply: function (script) {
                if (!script  || script.id === undefined) return false;
                this.setValue(script.code);
            }
        }
    }
};

/**
 * @constant
 * @memberof ui.ScriptingConsole
 */
const scripts_list = {
    view: 'list',
    select: true,
    template: '<span class="webix_icon mdi mdi-file-document-outline"></span> #name#',
    id: 'scripts_list'
};

/**
 * @constant
 * @memberof ui.ScriptingConsole
 */
const lower_toolbar = {
    view: 'toolbar',
    cols: [
        {
            view: "icon",
            icon: 'mdi mdi-play',
            click: function () {
                this.getTopParentView().execute();
            },
            hotkey: 'ctrl+enter',
            tooltip: 'Hotkey: ctrl+enter'
        },
        {}
    ]
};

/**
 * @constant
 * @memberof ui.ScriptingConsole
 */
const output = {
    view: 'fieldset',
    label: 'Script output',
    body: {
        view: 'textarea',
        readonly: true,
        id: 'output'
    }
};

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 * @property {String} name
 * @memberof ui.ScriptingConsole
 * @namespace scripting_console
 */
const scripting_console = webix.protoUI(
    /** @lends scripting_console */
    {
    name: 'scripting_console',
    /**
     * @return {UserScript}
     * @memberof ui.ScriptingConsole.scripting_console
     */
    save:function(){
        if(!this.isVisible() || this.$destructed) return;

        if(!this.$$('script_name').validate()) return;



        const id = this.$$('script_name').getValue().trim();
        const code = this.$$('script_code').getValue();

        return this.config.root.saveScript(new UserScript({id, code}))
    },
    /**
     * @return {UserScript}
     * @memberof ui.ScriptingConsole.scripting_console
     */
    remove:function(){
        if(!this.$$('script_name').validate()) return null;
        const id = this.$$('script_name').getValue().trim();


        this.config.root.removeScript(id);
    },
        /** @memberof ui.ScriptingConsole.scripting_console */
    execute: function () {
        if(!this.isVisible() || this.$destructed) return;

        const script = this.save();
        if(script == null) return;
        //TODO UserAction
        const $$output = this.$$('output');
        $$output.showProgress({
            type: "icon"
        });

        this.config.root.executeScript(script)
            .then(function (script) {
        //         TODO OK NOK etc

                $$output.setValue(script.result);
                $$output.hideProgress();
            })
            .catch(function (script) {
            //     TODO color analyze etc
                $$output.setValue(script.errors);
                $$output.hideProgress();
            });
    },
    ui: function (config) {
        return {
            rows: [
                {
                    gravity: 4,
                    multi: true,
                    cols: [
                        {
                            header: '<span class="webix_icon mdi mdi-notebook"></span> Scripts',
                            body: {
                                ...scripts_list,
                                on: {
                                    onAfterSelect:function(id){
                                        config.root.data.setCursor(id);
                                    }
                                }
                            }
                        },
                        {
                            gravity: 4,
                            body: {
                                rows: [
                                    upper_toolbar,
                                    script_code
                                ]
                            }
                        }
                    ]
                },
                {
                    view: 'resizer'
                },
                lower_toolbar,
                output
            ]
        }
    },
    /**
     * @memberof ui.ScriptingConsole.scripting_console
     * @constructor
     */
    $init: function (config) {
        webix.extend(config, this.ui(config));

        this.$ready.push(() => {
            this.$$('scripts_list').data.sync(config.root.data);
            this.$$('script_code').bind(config.root.data);
            this.$$('script_name').bind(config.root.data);

            webix.extend(this.$$('output'), webix.ProgressBar);
        });
    }
}, webix.IdSpace, webix.ui.layout);

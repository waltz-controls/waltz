/**
 * @module ScriptingConsole
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
import {ExecuteUserScript} from "../../src/models/tango_webapp/user_action.js";

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.textarea.html webix.ui.textarea}
 * @property {String} name
 * @property editor
 * @memberof ui.ScriptingConsole
 * @namespace codemirror_textarea
 */






export const codemirror_textarea = webix.protoUI(
    /** @lends codemirror_textarea.prototype */
    {
        name: "codemirror_textarea",
        editor: null,
        /**
         * @memberof ui.ScriptingConsole.codemirror_textarea
         */
        getValue: function () {
            return this.editor.getValue();
        },
        /**
         * @memberof ui.ScriptingConsole.codemirror_textarea
         */
        setValue: function (value) {
            if (!value || typeof value !== 'string') return;
            this.editor.setValue(value);
        },
        /**
         * @memberof ui.ScriptingConsole.codemirror_textarea
         * @constructor
         */
        $init: function (config) {
            this.$ready.push(function () {
                this.attachEvent('onAfterRender', function () {
                    if(MVC.env().match(/development|test/)) console.time('CodeMirror render');
                    var value;
                    if(this.editor != null){
                        value = this.editor.getValue();
                    }
                    this.editor = CodeMirror.fromTextArea(this.getInputNode(),
                        webix.extend({
                            extraKeys: {"Ctrl-Space": "autocomplete"},
                            commands: {
                                indentAuto: "Ctrl-Alt-l"
                            },
                            mode: config.mode || "javascript",
                            lineNumbers: true,
                            gutter: true,
                            lineWrapping: true
                        }, config));

                    this.setValue(value);
                    if(MVC.env().match(/development|test/)) console.timeEnd('CodeMirror render');
                    // ~ 20ms
                }.bind(this));

            }.bind(this));
        },
        defaults: {
            tooltip: 'Autocomplete: ctrl+space'
        }
    }, webix.ui.textarea);


(function () {


    /**
     * @constant
     * @memberof ui.ScriptingConsole
     * @namespace upper_toolbar
     */
    var upper_toolbar = {
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
    var script_code = {
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
    var scripts_list = {
        view: 'list',
        select: true,
        template: '<span class="webix_icon mdi mdi-file-document-outline"></span> #name#',
        id: 'scripts_list',
        on: {
            onAfterSelect:function(id){
                UserScript.store._data.setCursor(id);
            }
        }
    };

    /**
     * @constant
     * @memberof ui.ScriptingConsole
     */
    var lower_toolbar = {
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
    var output = {
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
    var scripting_console = webix.protoUI(
        /** @lends scripting_console */
        {
        name: 'scripting_console',
        /**
         * @return {UserScript}
         * @memberof ui.ScriptingConsole.scripting_console
         */
        save:function(){
            if(!this.isVisible() || this.$destructed) return;

            if(!this.$$('script_name').validate()) return null;
            var name = this.$$('script_name').getValue().trim();
            var code = this.$$('script_code').getValue();

            var script = UserScript.find_one(name);
            var attrs = {
                name: name,
                code: code
            };

            if (script == null)
                script = new UserScript(attrs);
            else
                script.update_attributes(attrs);

            TangoWebappHelpers.logWithPopup("Script " + script.name + " is saved!" );

            return script;
        },
        /**
         * @return {UserScript}
         * @memberof ui.ScriptingConsole.scripting_console
         */
        remove:function(){
            if(!this.$$('script_name').validate()) return null;
            var name = this.$$('script_name').getValue().trim();

            var script = UserScript.find_one(name);
            script.destroy();
            return script;
        },
            /** @memberof ui.ScriptingConsole.scripting_console */
        execute: function () {
            if(!this.isVisible() || this.$destructed) return;

            var script = this.save();
            if(script == null) return;
            //TODO UserAction
            var $$output = this.$$('output');
            $$output.showProgress({
                type: "icon"
            });

            new ExecuteUserScript({user: PlatformContext.UserContext.user, script: script})
                .submit()
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
        _ui: function () {
            return {
                rows: [
                    {
                        gravity: 4,
                        multi: true,
                        cols: [
                            {
                                header: '<span class="webix_icon mdi mdi-notebook"></span> Scripts',
                                body: scripts_list
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
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('scripts_list').data.sync(UserScript.store._data);
                this.$$('script_code').bind(UserScript.store._data);
                this.$$('script_name').bind(UserScript.store._data);

                webix.extend(this.$$('output'), webix.ProgressBar);
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.layout);

    /**
     * @param config
     * @memberof ui.ScriptingConsole
     */
    TangoWebapp.ui.newScriptingConsoleView = function (config) {
        config = config || {};
        return webix.extend({
            view: 'scripting_console'
        }, config);
    };

    /**
     * @extends scripting_console
     * @property {String} name
     * @memberof ui.ScriptingConsole
     * @namespace stateful_scripting_console
     */
    var stateful_scripting_console = webix.protoUI(
        /** @lends stateful_scripting_console */
        {
        name:'stateful_scripting_console',
        /**
         * @memberof ui.ScriptingConsole.stateful_scripting_console
         * @param {WidgetState} state
         */
        restoreState:function(state){
            var data = state.getState();
            for(var script in data){
                UserScript.create_as_existing({
                    name: script,
                    code: data[script]
                })
            }
        },
        /**
         * Overrides scripting_console.save by adding state update
         * @memberof ui.ScriptingConsole.stateful_scripting_console
         */
        save:function(){
            var script = webix.ui.scripting_console.prototype.save.apply(this, arguments);
            if(script == null) return null;
            var state = Object.create(null);
            state[script.name] = script.code;
            this.state.updateState(state);
            return script;
        },
        /**
         * Overrides scripting_console.delete by adding state update
         * @memberof ui.ScriptingConsole.stateful_scripting_console
         */
        remove:function(){
            var script = webix.ui.scripting_console.prototype.remove.apply(this, arguments);
            if(script == null) return null;
            var data = this.state.getState();
            delete data[script.name];
            this.state.setState(data);
            return script;
        }
    }, TangoWebappPlatform.mixin.Stateful, scripting_console);

    /**
     * @param config
     * @memberof ui.ScriptingConsole
     */
    TangoWebapp.ui.newStatefulScriptingConsoleView = function (config) {
        config = config || {};
        return webix.extend({
            view: 'stateful_scripting_console'
        }, config);
    };

    //TODO export
    TangoWebapp.ui.newStatefulScriptingConsoleTab = function () {
        return {
            header: "<span class='webix_icon wxi-pencil'></span> Scripting",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newStatefulScriptingConsoleView({id: 'scripting_console'})
        }
    };
})();

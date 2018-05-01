/**
 *
 * @module ScriptingConsole
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
(function () {
    /**
     * @type {webix.protoUI}
     */
    var codemirror_textarea = webix.protoUI({
        name: "codemirror_textarea",
        editor: null,
        getValue: function () {
            return this.editor.getValue();
        },
        setValue: function (value) {
            if (!value || typeof value !== 'string') return;
            this.editor.setValue(value);
        },
        $init: function () {
            this.$ready.push(function () {
                this.attachEvent('onAfterRender', function () {
                    // console.time('CodeMirror render');
                    this.editor = CodeMirror.fromTextArea(this.getInputNode(),{
                        lineNumbers: true,
                        gutter: true,
                        lineWrapping: true
                    });

                    if(UserScript.store._data.getCursor() != null)
                        this.setValue(UserScript.store._data.getItem(UserScript.store._data.getCursor()).code);
                    // console.timeEnd('CodeMirror render');
                    // ~ 20ms
                }.bind(this));

            }.bind(this));
        }
    }, webix.ui.textarea);

    /**
     *
     * @type {webix.config}
     */
    var upper_toolbar = {
        view: 'toolbar',
        cols: [
            {
                maxWidth: 380,
                view: 'text',
                id: 'script_name',
                placeholder: 'script name',
                label: 'Script name:',
                labelWidth: 100,
                on: {
                    onBindApply: function (script) {
                        if (!script) return;
                        this.setValue(script.name);
                    }
                }
            },
            {
                maxWidth: 30,
                view: 'button',
                type: "iconButton",
                icon: 'save',
                click: function () {
                    this.getTopParentView().save();
                },
                hotkey: 'ctrl+s'
            }
        ]
    };

    /**
     *
     * @type {webix.config}
     */
    var script_code = {
        view: 'fieldset',
        label: 'Script code',
        body: {
            view: 'codemirror_textarea',
            id: 'script_code',
            on: {
                onBindApply: function (script) {
                    if (!script) return;
                    this.setValue(script.code);
                }
            }
        }
    };

    /**
     *
     * @type {webix.config}
     */
    var scripts_list = {
        view: 'list',
        select: true,
        template: '<span class="webix_icon fa-file-text"></span> #name#',
        id: 'scripts_list',
        on: {
            onAfterSelect:function(id){
                UserScript.store._data.setCursor(id);
            }
        }
    };

    /**
     *
     * @type {webix.config}
     */
    var lower_toolbar = {
        maxHeight: 30,
        view: 'toolbar',
        cols: [
            {
                maxWidth: 30,
                view: 'button',
                type: "iconButton",
                icon: 'play',
                click: function () {
                    this.getTopParentView().execute();
                },
                hotkey: 'ctrl+enter'
            },
            {}
        ]
    };

    /**
     *
     * @type {webix.config}
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
     * @type {webix.protoUI}
     */
    var scripting_console = webix.protoUI({
        name: 'scripting_console',
        /**
         * @return {UserScript}
         */
        save:function(){
            if(!this.isVisible() || this.$destructed) return;

            //TODO validate
            var name = this.$$('script_name').getValue();
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
        execute: function () {
            if(!this.isVisible() || this.$destructed) return;

            var script = this.save();
            
            //TODO UserAction
            var $$output = this.$$('output');
            $$output.showProgress({
                type: "icon"
            });

            UserAction.executeUserScript(script)
                .then(function (result) {
                    //TODO OK NOK etc

                    $$output.setValue(result);
                    $$output.hideProgress();
                })
                .fail(function (err) {
                    //TODO color analyze etc
                    $$output.setValue(err.errors);
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
                                header: '<span class="webix_icon fa-book"></span> Scripts',
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

    TangoWebapp.ui.newScriptingConsoleView = function (config) {
        config = config || {};
        return webix.extend({
            view: 'scripting_console'
        }, config);
    };

    /**
     * @type {webix.protoUI}
     */
    var stateful_scripting_console = webix.protoUI({
        name:'stateful_scripting_console',
        /**
         *
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
         * Overrides attrs_monitor_view.addAttribute by adding state update
         *
         */
        save:function(){
            var script = webix.ui.scripting_console.prototype.save.apply(this, arguments);
            var state = Object.create(null);
            state[script.name] = script.code;
            this.state.updateState(state);
            return script;
        }
    }, TangoWebappPlatform.mixin.Stateful, scripting_console);

    TangoWebapp.ui.newStatefulScriptingConsoleView = function (config) {
        config = config || {};
        return webix.extend({
            view: 'stateful_scripting_console'
        }, config);
    };
})();

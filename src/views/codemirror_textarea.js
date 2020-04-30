// import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint.css';
//
// import '!!script-loader!codemirror/lib/codemirror.js';
// import '!!script-loader!codemirror/mode/javascript/javascript.js';
// import '!!script-loader!codemirror/addon/hint/show-hint.js';
// import '!!script-loader!codemirror/addon/hint/javascript-hint.js';

import "codemirror/formatting";

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.textarea.html webix.ui.textarea}
 * @property {String} name
 * @property editor
 * @memberof ui.ScriptingConsole
 * @namespace codemirror_textarea
 */
const codemirror_textarea = webix.protoUI(
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
            this.$ready.push(() => this.adjust());

            this.$ready.push(() => {
                this.attachEvent('onAfterRender', () => {
                    if(!PRODUCTION) console.time('CodeMirror render');
                    const value = (this.editor) ? this.editor.getValue() : undefined;
                    this.editor = CodeMirror.fromTextArea(this.getInputNode(),
                        {
                            extraKeys: {"Ctrl-Space": "autocomplete"},
                            commands: {
                                indentAuto: "Ctrl-Alt-l"
                            },
                            mode: config.mode || "javascript",
                            lineNumbers: true,
                            gutter: true,
                            lineWrapping: true,
                            viewportMargin: Infinity,
                            ...config
                        });

                    this.setValue(value);
                    if(!PRODUCTION) console.timeEnd('CodeMirror render');
                    // ~ 20ms
                });

            });
        },
        defaults: {
            tooltip: 'Autocomplete: ctrl+space'
        }
    }, webix.ui.textarea);

export default codemirror_textarea;
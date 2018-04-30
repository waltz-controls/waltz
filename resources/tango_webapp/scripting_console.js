/**
 *
 * @module ScriptingConsole
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
(function(){
    /**
     * @type {webix.protoUI}
     */
    var scripting_console = webix.protoUI({
        name: 'scripting_console',
        _ui: function(){
            return {
                rows:[
                    {
                        template: 'toolbar'
                    },
                    {
                        gravity: 4,
                        template: 'script'
                    },
                    {
                        template: 'output'
                    },
                    {
                        template: 'toolbar'
                    }
                ]
            }
        },
        $init: function(config){
            webix.extend(config, this._ui());
        }
    }, webix.ui.layout);

    TangoWebapp.ui.newScriptingConsoleView = function(config){
        return webix.extend({
            view: 'scripting_console'
        }, config);
    }
})();

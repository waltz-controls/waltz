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
                        view: 'toolbar',
                        maxHeight: 40,
                        cols:[
                            {
                                view: 'richselect',
                                id:'select_script',
                                options: []
                            },
                            {}
                        ]
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

            this.$ready.push(function(){
                this.$$('select-list').sync(UserScript.store._data)

            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.layout);

    TangoWebapp.ui.newToolsView = function(config){
        config = config || {};
        return webix.extend({
            view: 'tabview',
            cells: [
                {
                    header: "<span class='webix_icon fa-pencil-square-o'></span> Scripting",
                    body: {
                        view: 'scripting_console'
                    }
                },
                {
                    header: "<span class='webix_icon fa-terminal'></span> Terminal",
                    body: {
                        template: 'terminal'
                    }
                }
            ]
        }, config);
    }
})();

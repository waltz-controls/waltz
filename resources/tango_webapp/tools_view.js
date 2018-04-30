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
        execute:function () {
            var name = this.$$('script_name').getValue();
            var code = this.$$('script_code').getValue();
            var script = UserScript.find_one(name);
            var attrs = {
                name: name,
                code: code
            };
            if(script == null)
                    script = new UserScript(attrs);
            else
                script.update_attributes(attrs);
            //TODO validate
            //TODO UserAction
            script.execute()
                .then(function(result){
                    //TODO OK NOK etc
                    this.$$('output').setValue(result);
                }.bind(this))
                .fail(function(err){
                    //TODO color analyze etc
                    this.$$('output').setValue(err.errors);
                }.bind(this));
        },
        _ui: function(){
            return {
                rows:[
                    {
                        view: 'toolbar',
                        maxHeight: 30,
                        cols:[
                            {
                                view: 'combo',
                                id:'select_script',
                                placeholder: 'type to filter',
                                label: 'Select script:',
                                suggest:{
                                    filter:function(item, value){
                                        return item.name.indexOf(value) > -1;
                                    },
                                    template: '#name#',
                                    body:{
                                        template:"#name#"
                                    }
                                },
                                on: {
                                    onChange:function(script){
                                        UserScript.store._data.setCursor(script);
                                    }
                                }
                            },
                            {
                                gravity:3
                            }
                        ]
                    },
                    {
                        gravity: 4,
                        view: 'fieldset',
                        label: 'Script',
                        body: {
                            view: 'textarea',
                            id:'script_code',
                            on: {
                                onBindApply:function(script){
                                    if(!script) return;
                                    this.setValue(script.code);
                                }
                            }
                        }
                    },
                    {
                        maxHeight: 30,
                        view: 'toolbar',
                        cols: [
                            {
                                maxWidth:150,
                                view: 'text',
                                id: 'script_name',
                                placeholder:'script name',
                                on: {
                                    onBindApply:function(script){
                                        if(!script) return;
                                        this.setValue(script.name);
                                    }
                                }
                            },
                            {
                                maxWidth:30,
                                view: 'button',
                                type: "iconButton",
                                icon: 'play',
                                click:function(){
                                    this.getTopParentView().execute();
                                }
                            },
                            {}
                        ]
                    },
                    {
                        view: 'fieldset',
                        label: 'Output',
                        body: {
                            view:'textarea',
                            readonly:true,
                            id:'output'
                        }
                    }
                ]
            }
        },
        $init: function(config){
            webix.extend(config, this._ui());

            this.$ready.push(function(){
                this.$$('select_script').getList().data.sync(UserScript.store._data);
                this.$$('script_code').bind(UserScript.store._data);
                this.$$('script_name').bind(UserScript.store._data);
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

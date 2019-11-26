/**
 * @namespace CriticalErrorNoRest
 * @memberof ui
 */
(function(){
    /**
     * @param rest
     * @return {webix.config}
     *
     * @memberof ui.CriticalErrorNoRest
     */
    TangoWebapp.ui.newCriticalErrorWindow = function(rest){
        return {
            view:"window",
            id:"critical_error_no_rest",
            head:"<span class='webix_icon mdi mdi-alert' style='color: red;'></span>",
            position:"center",
            width: 480,
            height: 320,
            modal: true,
            body:{
                view: 'form',
                elements:[
                    { view:"label", label:"Failed to ping Tango REST API host!!!", height:50, align:"center", css: 'webix_strong'},
                    { view:"label", label:"Try to change it in the text field below!"},
                    { view: "text", name:'rest_url', align: "center", value: rest.url },
                    { view:"label", label:"Also make sure username/password are correct (requires logout)!"},
                    {
                        cols: [
                            {view: "button", css:"webix_primary", label: "Apply", click:function(){
                                    var newRestUrl = this.getFormView().elements['rest_url'].getValue();

                                    var tangoRestApi = new TangoRestApi({url: newRestUrl});
                                    PlatformContext.set_rest(tangoRestApi);

                                    $$('critical_error_no_rest').close();
                                }},
                            {view: "button", label: "Logout", click:function(){
                                    OpenAjax.hub.publish('platform.user_logout', {});
                                }}
                        ]
                    }
                ]
            }
        };
    }
})();
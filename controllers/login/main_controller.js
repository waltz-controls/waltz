/**
* Main controller
*
* @type {Login.MainController}
*/
Login.MainController = MVC.Controller.extend('main',{
    _ui: function(){
        return {
            id: 'login',
            view: 'layout',
            rows:[
                {
                    type: "header",
                    height: 252,
                    template: function () {
                        return "<div style='height:232px; padding-top: 10px; padding-bottom: 10px; width:100%'><img style='display:block; margin:auto; max-width: 100%; max-height: 100%;' src='../../images/platform/tango_in_color.png'/></div>";
                    }
                },
                {rows: [
                        {},
                        {
                            cols: [{}, {
                                view: "form",
                                id:'frmLogin',
                                elements: [
                                    {
                                        view: "text",
                                        name: "username",
                                        label: "Username",
                                        validate: webix.rules.isNotEmpty,
                                        invalidMessage: "Username can not be empty"
                                    },
                                    {
                                        view: "text",
                                        name: "password",
                                        type: "password",
                                        label: "Password",
                                        validate: webix.rules.isNotEmpty,
                                        invalidMessage: "Password can not be empty"
                                    },
                                    {
                                        cols: [
                                            {
                                                view: "button", value: "Login", type: "form", hotkey: "enter", click: function () {
                                                    var form = this.getFormView();
                                                    var isValid = form.validate();
                                                    if (!isValid) return;

                                                    webix.storage.session.put('Authorization', "Basic " + btoa(form.getValues().username + ":" + form.getValues().password));

                                                    window.location = "../../apps/tango_webapp/index.html";
                                                }
                                            },
                                            {
                                                view: "button", value: "Cancel", click: function () {
                                                    var form = this.getFormView();
                                                    form.clear();
                                                    form.clearValidation();
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }, {}]

                        },
                        {}
                    ]}
            ]
        };
    },
    /**
    * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
    *
    * @param {Object} params
    */
    load: function(params){
        webix.ui(Login.MainController._get_instance()._ui());

        webix.html.remove(document.getElementById('ajax-loader'));

        //automatically redirect is user is already logged in
        var authorization = webix.storage.session.get("Authorization");
        if(authorization != null && authorization.indexOf('Basic ') === 0){
            var decoded = atob(authorization.substring(6)).split(':');
            $$('frmLogin').setValues({
                username: decoded[0],
                password: decoded[1]
            });
        }
    }
});
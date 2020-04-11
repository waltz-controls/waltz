export class UserLogin{
    constructor({name, headers}){
        this.name = name;
        this.headers = headers;
    }
}

/**
 * Login controller
 * @type {LoginController}
 * @class
 *
 */
export class LoginController {
    ui(){
        return {
            id: 'login',
            view: 'layout',
            rows:[
                {
                    borderless: true,
                    height:240,
                    template: function () {
                        return "<div style='padding-top: 3em; width:100%'>" +
                            "<img style=' display:block; margin:auto; max-width: 100%; max-height: 100%;" +
                            "' src='../images/platform/logo_Waltz.png'/></div>";
                    }
                },
                {
                    rows: [
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
                                                    const form = this.getFormView();
                                                    if (!form.validate()) return;

                                                    const user = new UserLogin({
                                                        name: form.getValues().username,
                                                        headers: {
                                                            "Authorization" : "Basic " + btoa(form.getValues().username + ":" + form.getValues().password)
                                                        }
                                                    });


                                                    this.getTopParentView().callEvent('login', [user]);
                                                }
                                            },
                                            {
                                                view: "button", value: "Cancel", click: function () {
                                                    const form = this.getFormView();
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
    }

    /**
     *
     * @returns {Promise<UserLogin>}
     */
    run(){
        return new Promise((resolve, reject) => {
            let user;
            if((user = webix.storage.session.get('user')) !== null){
                resolve(user);
            } else {
                const login = webix.ui({
                    view: 'window',
                    autofocus: true,
                    fullscreen: true,
                    modal: true,
                    body: this.ui()
                });

                login.attachEvent('login',user => {
                    webix.storage.session
                        .put('user', user);

                    resolve(user)
                });

                login.show();
            }
        });
    }
}
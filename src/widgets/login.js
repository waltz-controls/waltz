import {WaltzWidget} from "@waltz-controls/middleware";
import UserLogin from "models/login";
import {kWaltz} from "../main";

export const kLogin = 'login';
export const kUser = 'user';
export default class LoginWidget extends WaltzWidget{
    constructor(app) {
        super(kLogin, app);
    }

    ui(){
        return {
            rows:[
                {
                    borderless: true,
                    height:240,
                    template: function () {
                        return `<div style='padding-top: 3em; width:100%'>
                                <img style='display:block; margin:auto; max-width: 100%; max-height: 100%;' src='images/platform/logo_Waltz.png'/>
                                </div>`;
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


                                                    this.getTopParentView().callEvent(kLogin, [user]);
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

    render() {
        return webix.ui({
            id:this.name,
            view: 'window',
            autofocus: true,
            fullscreen: true,
            modal: true,
            body: this.ui()
        });
    }

    login(user){
        this.app.getContext(kWaltz).then(waltz => waltz
            .registerContext(kLogin,this.app)
            .registerContext(kUser, user)
            .run()
        );
    }

    run() {
        let user;
        if((user = webix.storage.session.get(kUser)) !== null){
            this.login(user);
        } else {
            const login = this.render();

            login.attachEvent(kLogin,user => {
                login.destructor();
                this.login(user);
            });

            login.show();
        }
    }
}
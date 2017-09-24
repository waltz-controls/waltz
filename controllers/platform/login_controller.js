TangoWebapp.LoginController = MVC.Controller.extend("login_controller", {
    getUI: function () {
        return {
            id: 'login',
            view: 'window',
            fullscreen: true,
            modal: true,
            headHeight: 252,
            head: {
                template: function () {
                    return "<img src='images/logo.png'/>";
                }
            },
            body: {
                rows: [
                    {},
                    {
                        cols: [{}, {
                            view: "form",
                            elements: [
                                {
                                    view: "text",
                                    name: "name",
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
                                            view: "button", value: "Login", type: "form", click: function () {
                                            var form = this.getFormView();
                                            var isValid = form.validate();
                                            if (!isValid) return;

                                            OpenAjax.hub.publish('tango_webapp.user_login', form.getValues());
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
                ]

            }
        };
    }
}, {
    "tango_webapp.user_login subscribe": function (data) {
        var user_name = data.name;
        var user_password = data.password;
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            x.withCredentials = true;
            headers["Authorization"] = "Basic " + btoa(user_name + ":" + user_password);

        });

        TangoWebapp.debug("Attached Authorization header for " + user_name);

        $$("login").hide();
    },
    "tango_webapp.user_logout subscribe": function () {
        TangoWebapp.UserContext.instance.destroy();

        $$("login").show();
    }
});
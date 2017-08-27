webix.protoUI({
    name: "login",
    _getUI: function () {
        var self = this;
        return {
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

                                            Credentials.create_as_existing(form.getValues());

                                            self.hide();
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
    },
    $init: function (config) {
        webix.extend(config, this._getUI());
    },
    defaults: {
        id: "login"
    }
}, webix.ui.window);
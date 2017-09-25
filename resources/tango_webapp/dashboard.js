(function () {
    var getting_started = {
        minWidth: 240,
        minHeight: 240,
        template: new View({url: 'views/getting_started.ejs'}).render()
    };

    webix.protoUI({
        name: 'dashboard_tango_hosts',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        template: "Tango hosts"
                    },
                    {
                        gravity: 6,
                        id: 'tango_hosts',
                        view: 'list',
                        template: "#id#"
                    },
                    {
                        view: 'form',
                        height: 80,
                        elements: [
                            {
                                cols: [
                                    {
                                        view: 'text',
                                        name: 'new_tango_host',
                                        placeholder: 'localhost:10000',
                                        invalidMessage: "Value does not match pattern: host:port",
                                        validate: function (value) {
                                            return /\w+:\d+/.test(value);
                                        },
                                        suggest: [] //TODO
                                    },
                                    {
                                        view: 'button',
                                        type: 'icon',
                                        icon: 'plus-square-o',
                                        width: 32,
                                        click: function () {
                                            var form = this.getFormView();
                                            var isValid = form.validate();
                                            if (!isValid) return;

                                            UserContext.current.add_tango_host(form.elements.new_tango_host.getValue());
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
        },
        defaults: {
            minWidth: 320,
            minHeight: 480,
            on: {
                "tango_webapp.platform_context.add_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').data.sync(event.data.tango_hosts);
                },
                "tango_webapp.user_logout subscribe": function () {
                    $$('dashboard').$$('tango_hosts').clearAll();
                    $$('dashboard').$$('tango_hosts').refresh();
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.ui.layout);


    webix.protoUI({
        name: "dashboard",
        _ui: function () {
            return {
                cols: [
                    {
                        minWidth: 20
                    },
                    {
                        rows: [
                            {},
                            getting_started,
                            {
                                height: 5
                            },
                            {
                                minWidth: 240,
                                minHeight: 240,
                                template: "Device filters"
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                view: 'dashboard_tango_hosts',
                                id: 'dashboard-tango-hosts'
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                minWidth: 320,
                                minHeight: 480,
                                id: 'tango_host_info',
                                datatype: 'jsarray',
                                template: "???",
                                data: new Array(14)
                            },
                            {}
                        ]
                    },
                    {},
                    {
                        rows: [
                            {},
                            {
                                minWidth: 320,
                                minHeight: 480,
                                template: "Device Info"
                            },
                            {}
                        ]
                    },
                    {
                        minWidth: 20
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.$$('tango_host_info').bind(this.$$('tango_hosts'))
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.layout);
})();


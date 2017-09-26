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
                        template: "<span class='webix_strong'>Tango hosts</span>",
                        height: 40
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

                                            UserContext.add_tango_host(form.elements.new_tango_host.getValue());
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        gravity: 6,
                        id: 'tango_hosts',
                        view: 'list',
                        autoheight: true,
                        select: true,
                        template: "<span class='webix_icon fa-minus-square-o remove_tango_host'></span> #id#",
                        on: {
                            onItemClick: function (id) {
                                PlatformContext.tango_hosts.setCursor(id);
                            }
                        },
                        onClick: {
                            remove_tango_host: function (event, id) {
                                UserContext.delete_tango_host(id);
                            }
                        }
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480,
            on: {
                "user_context.init subscribe": function (event) {
                    var data = [];
                    var context = event.data;

                    for (var tango_host in context.tango_hosts) {
                        if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                        data.push({
                            id: tango_host
                        });
                    }

                    $$('dashboard').$$('tango_hosts').parse(data);
                },
                "user_context.add_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').add({
                        id: event.data
                    });
                },
                "user_context.delete_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').remove(event.data);
                },
                "user_context.destroy subscribe": function () {
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


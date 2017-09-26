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
                        template: "<span class='webix_icon fa-server'></span><span class='webix_strong'> TANGO hosts</span>",
                        height: 40
                    },
                    {
                        view: 'form',
                        height: 60,
                        elements: [
                            {
                                cols: [
                                    {
                                        view: 'text',
                                        id: "new-tango-host",
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

            this.$ready.push(function () {
                var data = [];
                var context = PlatformContext.user_context;

                for (var tango_host in context.tango_hosts) {
                    if (!context.tango_hosts.hasOwnProperty(tango_host)) continue;

                    data.push({
                        id: tango_host
                    });
                }

                $$('dashboard').$$('tango_hosts').parse(data);
            });
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480,
            on: {
                "user_context.add_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').add({
                        id: event.data
                    });
                    var rest = PlatformContext.rest;
                    rest.fetchHost(event.data).then(function (tango_host) {
                        TangoWebappHelpers.log(tango_host.id + " has been added.");
                    })
                },
                "user_context.delete_tango_host subscribe": function (event) {
                    $$('dashboard').$$('tango_hosts').remove(event.data);

                    //TODO do we need to remove tango_host from context here?
                },
                "user_context.destroy subscribe": function () {
                    $$('dashboard').$$('tango_hosts').clearAll();
                    $$('dashboard').$$('tango_hosts').refresh();
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.ui.layout);


    webix.protoUI({
        name: 'tango_host_info',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 40,
                        template: "<span class='webix_icon fa-database'></span><span class='webix_strong'> TANGO host info</span>"
                    },
                    {
                        autoheight: true,
                        id: "tango-host-info-value",
                        template: function (obj, $view) {
                            if (obj.Class === undefined) return "Please choose TANGO host in the list to view the info";
                            if (obj.isAlive)
                                return "<span class='webix_strong'>" + obj.id + "</span>  is alive!" +
                                    "<hr/><div style='display: block'>" + obj.info.join('<br/>') + "</div>";
                            else
                                return "<span class='webix_icon fa-frown-o'></span><span class='webix_strong'>" + obj.id + "</span>  is not alive!";
                        }
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('tango-host-info-value')
                    .bind(PlatformContext.tango_hosts)
            }.bind(this));
        },
        defaults: {
            minWidth: 320,
            maxHeight: 480
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

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
                                view: 'tango_host_info',
                                id: 'tango-host-info'

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
        }
    }, webix.IdSpace, webix.ui.layout);
})();


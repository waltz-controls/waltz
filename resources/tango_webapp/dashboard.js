(function () {
    var getting_started = {
        minWidth: 320,
        minHeight: 320,
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
                        template: "input"
                    },
                    {
                        gravity: 6,
                        id: 'tango_hosts',
                        view: 'list'
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
        },
        on: {
            "tango_webapp.context.new_tango_host subscribe": function (data) {
                debugger
            }
        },
        defaults: {
            minWidth: 320,
            minHeight: 640
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
                            {},
                            {
                                minWidth: 320,
                                minHeight: 320,
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
                                minHeight: 640,
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
                                minHeight: 640,
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
        },
        on: {}
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);
})();


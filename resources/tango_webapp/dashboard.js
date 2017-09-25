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
                        id: 'hosts',
                        gravity: 6,
                        view: 'accordion',
                        cols: [
                            {header: "col 1", body: "content 1"},
                            {header: "col 2", body: "content 2"}
                        ]
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
        },
        on: {}
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);
})();


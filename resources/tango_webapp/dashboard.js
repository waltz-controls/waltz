(function () {
    var getting_started = {
        minWidth: 320,
        minHeight: 320,
        template: new View({url: 'views/getting_started.ejs'}).render()
    };


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
                                minWidth: 320,
                                minHeight: 640,
                                template: "Tango Hosts"
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


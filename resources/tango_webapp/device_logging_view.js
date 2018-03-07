(function () {
    var device_logging = webix.protoUI({
        _logging_level: ["OFF", "FATAL", "ERROR", "WARNING", "INFO", "DEBUG"],
        _labels: {
            "logging_level": "Logging level",
            "GetLoggingLevel": "Current logging level",
            "logging_target": "Logging target",
            "GetLoggingTarget": "Current logging target",
            "logging_rft": "Logging RFT"
        },
        _ui: function () {
            var top = this;
            return {
                rows: [
                    {
                        id: "logging",
                        view: "datatable",
                        columns: [
                            {id: 'name', header: "Property name", width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH},
                            {id: 'value', header: "Value", fillspace: true}
                        ]
                    },

                    {
                        view: "toolbar",
                        cols: [
                            {
                                view: "button",
                                id: "btnRefresh",
                                value: "Refresh",
                                width: 100,
                                align: "left",
                                click: top.refresh
                                //},
                                //{
                                //    view: "button", id: "btnApply", value: "Apply", width: 100, align: "left", click: webix.assert_error.bind(null, "Not yet implemented!")
                            }
                        ]
                    }

                ]
            };
        },
        refresh: function () {
            var top = this.getTopParentView();
            top.$$('logging').clearAll();

            var db = top._device.host.fetchDatabase();
            var device = top._device;
            var admin = top._device.fetchAdmin();
            var dataPromise =
                webix.promise.all([
                    db.then(function (db) {
                        return db.getDeviceProperty([device.name, "logging_level", "logging_target", "logging_rft"]).then(function (resp) {
                            return [
                                {
                                    name: top._labels[resp.output[2]],
                                    value: resp.output[4]
                                },
                                {
                                    name: top._labels[resp.output[5]],
                                    value: resp.output[4]
                                },
                                {
                                    name: top._labels[resp.output[8]],
                                    value: resp.output[10]
                                }
                            ];
                        })
                    }),
                    admin.then(function (admin) {
                        return admin.getLoggingLevel([top._device.name]);
                    }).then(function (resp) {
                        return {
                            name: top._labels["GetLoggingLevel"],
                            value: top._logging_level[resp.output.lvalue[0]]
                        };
                    }),
                    admin.then(function (admin) {
                        return admin.getLoggingTarget(top._device.name);
                    }).then(function (resp) {
                        return {
                            name: top._labels["GetLoggingTarget"],
                            value: resp.output
                        };
                    })
                ]).then(function (results) {
                    results[0].push(results[1], results[2]);
                    return results[0]
                });


            top.$$('logging').parse(dataPromise);
        },
        name: "device_logging",
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                //request logging levels from admin device
                this.refresh();
            });
        }
    }, webix.IdSpace, TangoWebappPlatform.mixin.TabActivator, TangoWebappPlatform.mixin.DeviceSetter, webix.ui.layout);

    TangoWebapp.ui.newDeviceLoggingView = function (device) {
        return {
            device: device,
            view: "device_logging",
            id: "device-logging"
        }
    };
})();
webix.protoUI({
    _logging_level: ["OFF", "FATAL", "ERROR", "WARNING", "INFO", "DEBUG"],
    _labels       : {
        "logging_level"   : "Logging level",
        "GetLoggingLevel" : "Current logging level",
        "logging_target"  : "Logging target",
        "GetLoggingTarget": "Current logging target",
        "Logging_rft"     : "Logging RFT"
    },
    _getUI        : function () {
        var top = this;
        return {
            rows: [
                {
                    id     : "logging",
                    view   : "datatable",
                    columns: [
                        {id: 'name', header: "Property name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                        {id: 'value', header: "Value", fillspace: true}
                    ]
                },

                {
                    view: "toolbar",
                    cols: [
                        {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left", click: top.refresh},
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"}]
                }

            ]
        };
    },
    refresh       : function () {
        var top = this.getTopParentView();
        top.$$('logging').clearAll();

        var dataPromise =
            top._admin.then(function (admin) {
                admin.executeCommand("GetLoggingLevel", top._device.name).then(function (resp) {
                    return [{
                        name : top._labels["GetLoggingLevel"],
                        value: top._logging_level[resp.output.lvalue[0]]
                    }];
                })});


        top.$$('logging').parse(dataPromise);
        //top.$$('logging').parse(webix.promise.all(
        //    []
        //        //TODO mTango#107
        //        //from db
        //        //["logging_level", "logging_target", "logging_rft"].map(function (prop) {
        //        //    return self._db.DbGetDeviceProperty([self._device.name, prop]).then(function (resp) {
        //        //        return {
        //        //            name : self._labels[prop],
        //        //            value: resp.output
        //        //        };
        //        //    })
        //        //})
        //        //from admin
        //        .concat(top._admin.then(function (admin) {
        //            return webix.promise.all(
        //                admin.executeCommand("GetLoggingLevel", top._device.name).then(function (resp) {
        //                    return {
        //                        name : top._labels["GetLoggingLevel"],
        //                        value: top._logging_level[resp.output.lvalue[0]]
        //                    };
        //                }), admin.executeCommand("GetLoggingTarget", top._device.name).then(function (resp) {
        //                    return {
        //                        name : top._labels["GetLoggingTarget"],
        //                        value: resp.output.toString()
        //                    };
        //                }))
        //        })
        //    )).then(function(result){
        //        return result;
        //    }));
    },
    name          : "DeviceLogging",
    $init         : function (config) {
        webix.extend(config, this._getUI());

        this._admin = config.device.info().then(function (info) {
            return new Device("dserver/" + info.server);
        });

        this._db = TangoWebapp.getDatabase();

        this.$ready.push(function () {
            //request logging levels from admin device
            //this.refresh();
        }.bind(this));
    }
}, webix.IdSpace, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.ui.newDeviceLogging = function (device) {
    return {
        device: device,
        view  : "DeviceLogging",
        id    : "device_logging"
    }
};
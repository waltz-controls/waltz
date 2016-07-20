webix.protoUI({
    refresh: function () {
        var map = function (el) {
            var lines = el.split('\n');
            return {
                name    : lines[0].split(' = ')[1],
                isPolled: true,
                period  : lines[1].split(' = ')[1]
            };
        };

        var f = function (resp) {
            return function (type) {
                return resp.output.filter(function (el) {
                    return el.indexOf(type + " name") > -1
                }).map(map);
            }
        };

        this.getTopParentView()._admin.then(function (admin) {
            return admin.executeCommand("DevPollStatus", this._device.name);
        }.bind(this.getTopParentView())).then(function (resp) {
            var result = f(resp);

            this.$$commands.clearAll();
            this.$$commands.parse(result("command"));

            this.$$attributes.clearAll();
            this.$$attributes.parse(result("attribute"));
        }.bind(this.getTopParentView()));
    },
    _getUI : function () {
        var top = this;
        return {
            rows: [
                {
                    height: 5
                },
                {
                    view : "tabview",
                    cells: [
                        {
                            header: "Commands",
                            body  : {
                                id     : "commands",
                                view   : "datatable",
                                columns: [
                                    {id: "name", header: "Command name"},
                                    {id: "isPolled", header: "Is Polled"},
                                    {id: "period", header: "Period (ms)", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Attributes",
                            body  : {
                                id     : "attributes",
                                view   : "datatable",
                                columns: [
                                    {id: "name", header: "Attribute name"},
                                    {id: "isPolled", header: "Is Polled"},
                                    {id: "period", header: "Period (ms)", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Settings",
                            body  : {
                                id     : "settings",
                                view   : "datatable",
                                columns: [
                                    {header: "Parameters name"},
                                    {header: "Value"}
                                ]

                            }
                        }
                    ]
                },
                {
                    view: "toolbar",
                    cols: [
                        {
                            view : "button",
                            id   : "btnRefresh",
                            value: "Refresh",
                            width: 100,
                            align: "left",
                            click: top.refresh
                        },
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"},
                        {view: "button", id: "btnReset", value: "Reset", width: 100, align: "left"}]
                }
            ]
        }
    },
    name   : "DevicePolling",
    $init  : function (config) {
        webix.extend(config, this._getUI());

        var className = TangoWebapp.db.DbGetClassForDevice(config.device.name);

        this._admin = className.then(function (resp) {
            return new Device("dserver/" + resp.output + "/" + config.device.name.split('/')[0]);
        }.bind(this));

        this.$ready.push(function () {
            this.$$commands = this.$$('commands');
            this.$$attributes = this.$$('attributes');
            this.$$settings = this.$$('settings');
        }.bind(this));

        this.$ready.push(this.refresh);
    }
}, webix.IdSpace, TangoWebapp.DeviceTabActivator, TangoWebapp.DeviceSetter, webix.ui.layout);

TangoWebapp.newDevicePolling = function (device) {
    return {
        device: device,
        view  : "DevicePolling",
        id    : "device_polling"
    }
};
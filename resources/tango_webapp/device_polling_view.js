(function () {

    var device_polling = webix.protoUI({
        refresh: function () {
            var map = function (el) {
                var lines = el.split('\n');
                return {
                    name: lines[0].split(' = ')[1],
                    isPolled: true,
                    isNewPolled: false,
                    period: lines[1].split(' = ')[1]
                };
            };

            var f = function (resp) {
                return function (collection, type) {
                    debugger
                    var polled = resp.output.filter(function (el) {
                        return el.indexOf(type + " name") > -1
                    }).map(map);

                    TangoWebappHelpers.iterate(collection, function (item, id) {
                        var found = polled.find(function (el) {
                            return el.name === item.name;
                        });

                        if (found) collection.updateItem(id, found);
                    });
                }
            };

            var top = this.getTopParentView();
            top._device.fetchAdmin().then(function (admin) {
                return admin.devPollStatus(this._device.name);
            }.bind(top))
                .then(function (resp) {
                    f(resp)(this._commands, 'command');
                    f(resp)(this._attributes, 'attribute');
                }.bind(top));
        },
        apply: function () {
            var top = this.getTopParentView();

            var device_name = top._device.name;

            function addObjPolling(item, type) {
                return function (admin) {
                    admin.addObjPolling({
                        lvalue: [item.period],
                        svalue: [device_name, type, item.name]
                    }).fail(TangoWebappHelpers.error);
                }
            }

            function updObjPolling(item, type) {
                return function (admin) {
                    admin.updObjPollingPeriod({
                        lvalue: [item.period],
                        svalue: [device_name, type, item.name]
                    }).fail(TangoWebappHelpers.error);
                }
            }

            function remObjPolling(item, type) {
                return function (admin) {
                    admin.remObjPolling([device_name, type, item.name]).fail(TangoWebappHelpers.error);
                }
            }


            function setObjPolling(type) {
                return function (item) {
                    if (item.isPolled)
                        if (item.isNewPolled)
                            this._device.fetchAdmin().then(addObjPolling(item, type));
                        else
                            this._device.fetchAdmin().then(updObjPolling(item, type));
                    else if (!item.isNewPolled)
                        this._device.fetchAdmin().then(remObjPolling(item, type));
                }
            }

            TangoWebappHelpers.iterate(top._commands, setObjPolling('command').bind(top));
            TangoWebappHelpers.iterate(top._attributes, setObjPolling('attribute').bind(top));
        },
        reset: function () {
            var device_name = this._device.name;
            var admin = this._device.promiseAdmin();

            function removePolling(type) {
                return function (el, item) {
                    admin.then(function (admin) {
                        admin.remObjPolling([device_name, type, item.name]).fail(TangoWebappHelpers.error);
                    });
                }
            }

            TangoWebappHelpers.iterate(this._commands, removePolling("command"));
            TangoWebappHelpers.iterate(this._attributes, removePolling("attribute"));

            webix.alert({
                title: "Confirm reset",
                type: "alert-warning",
                text: "Done. Please restart " + device_name + "!"
            });
        },
        _ui: function () {
            var top = this;
            return {
                rows: [
                    {
                        height: TangoWebappPlatform.consts.TABS_DELIMITER_HEIGHT
                    },
                    {
                        view: "tabview",
                        cells: [
                            {
                                header: "Commands",
                                body: {
                                    id: "commands",
                                    view: "datatable",
                                    editable: true,
                                    columns: [
                                        {id: "name", header: "Command", width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH},
                                        {id: "isPolled", header: "Is Polled", template: "{common.checkbox()}"},
                                        {id: "period", header: "Period (ms)", fillspace: true, editor: "text"}
                                    ],
                                    rules: {
                                        "period": webix.rules.isNumber
                                    }
                                }
                            },
                            {
                                header: "Attributes",
                                body: {
                                    id: "attributes",
                                    view: "datatable",
                                    editable: true,
                                    columns: [
                                        {id: "name", header: "Attribute", width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH},
                                        {id: "isPolled", header: "Is Polled", template: "{common.checkbox()}"},
                                        {id: "period", header: "Period (ms)", fillspace: true, editor: "text"}
                                    ],
                                    rules: {
                                        "period": webix.rules.isNumber
                                    }
                                }
                                //},
                                //{
                                //    header: "Settings",
                                //    body  : {
                                //        id     : "settings",
                                //        editable   : true,
                                //        view   : "datatable",
                                //        columns: [
                                //            {header: "Parameters name", editor: "text"},
                                //            {header: "Value", editor: "text"}
                                //        ]
                                //
                                //    }
                            }
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
                            },
                            {
                                view: "button",
                                id: "btnApply",
                                value: "Apply",
                                width: 100,
                                align: "left",
                                click: top.apply
                            },
                            {
                                view: "button",
                                id: "btnReset",
                                value: "Reset",
                                width: 100,
                                align: "left",
                                click: function () {
                                    webix.confirm({
                                        title: "Confirm reset",
                                        ok: "Yes",
                                        cancel: "No",
                                        type: "confirm-error",
                                        text: "This will reset configuration for all commands and attributes.\n Continue?",
                                        callback: function (ok) {
                                            if (ok)
                                                top.callEvent('onResetConfirmed');
                                        }
                                    });
                                }
                            }]
                    }
                ]
            }
        },
        name: "device_polling",
        map: function (arg) {
            return arg.map(function (el) {
                return {
                    name: el.name,
                    isPolled: false,
                    isNewPolled: true,
                    period: ""
                }
            });
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            //TODO sync
            this._commands = new webix.DataCollection();
            this._commands.parse(config.device.fetchCommands().then(this.map));

            this._attributes = new webix.DataCollection();
            this._attributes.parse(config.device.fetchAttrs().then(this.map));

            this.$ready.push(function () {
                this.$$commands = this.$$('commands');
                this.$$attributes = this.$$('attributes');
                this.$$settings = this.$$('settings');

                this.$$commands.data.sync(this._commands);
                this.$$attributes.data.sync(this._attributes);
            }.bind(this));

            this.$ready.push(this.refresh);
        },
        defaults: {
            on: {
                onResetConfirmed: function () {
                    this.reset();
                }
            }
        }
    }, webix.IdSpace, webix.EventSystem, TangoWebappPlatform.mixin.TabActivator, TangoWebappPlatform.mixin.DeviceSetter, webix.ui.layout);

    TangoWebapp.ui.newDevicePollingView = function (device) {
        return {
            device: device,
            view: "device_polling",
            id: "device-polling"
        }
    };
})();
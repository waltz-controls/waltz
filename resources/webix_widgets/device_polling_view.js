/** @module DevicePollingView
 *  @memberof ui
 */
(function () {
    const pollable_datatable = webix.protoUI({
        name: 'pollable_datatable',
        apply(){

        },
        refresh(){

        },
        reset(){

        },
        $init(config){
            this.$ready.push(() => {
                this.data.sync(config.pollables);
            })
        },
        defaults:{
            editable: true,
            columns: [
                {
                    id: "name",
                    header: "Command",
                    width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
                },
                {id: "isNewPolled", header: "Is Polled", template: "{common.checkbox()}", width: 40},
                {id: "poll_rate", header: "Period (ms)", fillspace: true, editor: "text"}
            ],
            rules: {
                "poll_rate": webix.rules.isNumber
            }
        }

    },webix.IdSpace,webix.ui.datatable);


    function map(line) {
        const lines = line.split('\n');
        return {
            name: lines[0].split(' = ')[1],
            polled: true,
            isNewPolled: true,
            poll_rate: lines[1].split(' = ')[1]
        };
    }


    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof  ui.DevicePollingView
     * @namespace device_polling
     */
    var device_polling = webix.protoUI(
        /** @lends  device_polling.prototype */
        {
            /**
             * @memberof ui.DevicePollingView.device_polling
             */
            refresh: function () {
                debugger
                this.config.device.pollStatus();

                this.$$commands.refresh();

                return;
                TangoWebappHelpers.iterate(this.$$attributes, (item, id) => {
                    item.update_attributes({
                        polled: false,
                        isNewPolled: false,
                        poll_rate: ""
                    });
                });

                TangoWebappHelpers.iterate(this.$$commands, (item, id) => {
                    item.update_attributes({
                        polled: false,
                        isNewPolled: false,
                        poll_rate: ""
                    });
                });

                this._device.fetchAdmin().then(admin => admin.devPollStatus(this._device.name))
                    .then((resp) => {
                        resp.output.filter(line => line.includes(" attribute "))
                            .map(map)
                            .forEach(pollable => {
                                TangoWebappHelpers.iterate(this.$$attributes, (item, id) => {
                                    if (item.name === pollable.name)
                                        this.$$attributes.updateItem(id, pollable);
                                });
                            });

                        resp.output.filter(line => line.includes(" command "))
                            .map(map).forEach(pollable => {
                            TangoWebappHelpers.iterate(this.$$commands, (item, id) => {
                                if (item.name === pollable.name)
                                    this.$$commands.updateItem(id, pollable);
                            });
                        });
                    });
            },
            /** @memberof ui.DevicePollingView.device_polling */
            apply: function () {
                function setObjPolling(item) {
                    this._device.fetchAdmin().then(admin => {
                        return admin.updatePolling(this._device.name, item, item.isNewPolled, item.poll_rate);
                    }).then(pollable => {
                        item.update_attributes(pollable)
                    }).fail(TangoWebappHelpers.error);
                }

                TangoWebappHelpers.iterate(this.$$commands, setObjPolling.bind(this));
                TangoWebappHelpers.iterate(this.$$attributes, setObjPolling.bind(this));
            },
            /** @memberof  ui.DevicePollingView.device_polling */
            reset: function () {
                var device_name = this._device.name;
                var admin = this._device.fetchAdmin();

                function removePolling(type) {
                    return function (item, id) {
                        if (item.polled)
                            return admin.then(function (admin) {
                                admin.remObjPolling([device_name, type, item.name]);
                            }).then(() => item.update_attributes({
                                polled: false,
                                isNewPolled: false
                            }))
                                .fail(TangoWebappHelpers.error);
                    }
                }

                TangoWebappHelpers.iterate(this.$$commands, removePolling("command"));
                TangoWebappHelpers.iterate(this.$$attributes, removePolling("attribute"));

                webix.alert({
                    title: "Confirm reset",
                    type: "alert-warning",
                    text: "Done. Please restart " + device_name + "!"
                });
            },
            _ui: function (device) {
                var top = this;
                return {
                    rows: [
                        {
                            height: TangoWebappPlatform.consts.TABS_DELIMITER_HEIGHT
                        },
                        {
                            view: "tabview",
                            id: "tabview",
                            cells: [
                                {
                                    header: "Commands",
                                    body: {
                                        id: "commands",
                                        view: "pollable_datatable",
                                        pollables: device.commands
                                    }
                                },
                                {
                                    header: "Attributes",
                                    body: {
                                        id: "attributes",
                                        view: "datatable",
                                        editable: true,
                                        columns: [
                                            {
                                                id: "name",
                                                header: "Attribute",
                                                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
                                            },
                                            {id: "isNewPolled", header: "Is Polled", template: "{common.checkbox()}"},
                                            {id: "poll_rate", header: "Period (ms)", fillspace: true, editor: "text"}
                                        ],
                                        rules: {
                                            "poll_rate": webix.rules.isNumber
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
                                    click() {
                                        this.getTopParentView().refresh();
                                    }
                                },
                                {
                                    view: "button",
                                    id: "btnApply",
                                    value: "Apply",
                                    width: 100,
                                    align: "left",
                                    click() {
                                        this.getTopParentView().apply();
                                    }
                                },
                                {
                                    view: "button",
                                    id: "btnReset",
                                    value: "Reset",
                                    width: 100,
                                    align: "left",
                                    click() {
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
                                }
                            ]
                        }
                    ]
                }
            },
            name: "device_polling",
            /**
             * @memberof  ui.DevicePollingView.device_polling
             * @constructor
             */
            $init: function (config) {
                webix.extend(config, this._ui(config.device));

                config.device.fetchCommands();
                config.device.fetchAttrs();

                this.$ready.push(function () {
                    this.$$commands = this.$$('commands');
                    this.$$attributes = this.$$('attributes');
                    this.$$settings = this.$$('settings');

                    // this.$$commands.data.sync(config.device.commands);
                    this.$$attributes.data.sync(config.device.attrs);
                    this.refresh();
                }.bind(this));

            },
            defaults: {
                on: {
                    onResetConfirmed: function () {
                        this.reset();
                    }
                }
            }
        }, webix.IdSpace, webix.EventSystem, TangoWebappPlatform.mixin.TabActivator, TangoWebappPlatform.mixin.DeviceSetter, webix.ui.layout);

    /**
     * @param device
     * @memberof ui.DevicePollingView
     */
    TangoWebapp.ui.newDevicePollingView = function (device) {
        return {
            device: device,
            view: "device_polling",
            id: "device-polling"
        }
    };
})();
/** @module DevicePollingView
 *  @memberof ui
 */
(function () {
    const pollable_datatable = webix.protoUI({
        name: 'pollable_datatable',
        apply(){
            this.data.each(pollable => {
                if(pollable.isNewPolled || pollable.polled !== pollable.isNewPolled)
                    pollable.wrapped.updatePolling(pollable.isNewPolled, pollable.poll_rate).fail(TangoWebappHelpers.error);
            });
        },
        update(){
            const transformed = [];
            this.config.pollables.data.each(pollable => {
                transformed.push({
                    id: pollable.id,
                    wrapped: pollable,
                    name: pollable.name,
                    polled: pollable.polled,
                    poll_rate: pollable.poll_rate,
                    isNewPolled: pollable.polled
                });
            });
            this.parse(transformed);
        },
        reset(){
            this.data.each(pollable => {
                if(pollable.isNewPolled || pollable.polled !== pollable.isNewPolled)
                    pollable.wrapped.updatePolling(false)
                        .then(() => {
                            this.updateItem(pollable.id,{
                                polled: false,
                                isNewPolled: false,
                                poll_rate: undefined
                            });
                        })
                        .fail(TangoWebappHelpers.error);
            });
        },
        _config(){
            return {
                editable: true,
                columns: [
                    {
                        id: "name",
                        header: "Name",
                        width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH
                    },
                    {id: "isNewPolled", header: "Is Polled", template: "{common.checkbox()}", width: 40},
                    {id: "poll_rate", header: "Period (ms)", fillspace: true, editor: "text"}
                ],
                rules: {
                    "poll_rate": webix.rules.isNumber
                }
            }
        },
        $init(config){
            webix.extend(config, this._config())
        },
        defaults: {
            on:{
                onDataUpdate(){
                    debugger
                },
                onAfterLoad(){
                    debugger
                },
                onBindUpdate(){
                    debugger
                },
                onBindRequest(){
                    debugger
                }
            }
        }
    },webix.IdSpace,webix.ui.datatable);

    const toolbar = {
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
                    const top = this.getTopParentView();
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
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof  ui.DevicePollingView
     * @namespace device_polling
     */
    var device_polling = webix.protoUI(
        /** @lends  device_polling.prototype */
        {
            get activeTab(){
                const tab = this.$$('tabview').getTabbar().getValue();
                if(tab === 'attributes')
                    return this.$$attributes;
                else if (tab === 'commands')
                    return this.$$commands;
                else throw new Error("AssertionError: attributes or commands is expected here!");
            },
            /**
             * @memberof ui.DevicePollingView.device_polling
             */
            async refresh() {
                await this.config.device.pollStatus();

                this.activeTab.update();
            },
            /** @memberof ui.DevicePollingView.device_polling */
            apply() {
                // await this.config.device.pollStatus();
                this.activeTab.apply();
            },
            /** @memberof  ui.DevicePollingView.device_polling */
            reset: function () {
                this.activeTab.reset();
            },
            _ui: function (device) {
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
                                    header: "Attributes",
                                    body: {
                                        id: "attributes",
                                        view: "pollable_datatable",
                                        pollables: device.attrs
                                    }
                                },
                                {
                                    header: "Commands",
                                    body: {
                                        id: "commands",
                                        view: "pollable_datatable",
                                        pollables: device.commands
                                    }
                                }
                            ]
                        },
                        toolbar
                    ]
                }
            },
            name: "device_polling",
            /**
             * @memberof  ui.DevicePollingView.device_polling
             * @constructor
             */
            $init(config) {
                webix.extend(config, this._ui(config.device));

                this.$ready.push(async function () {
                    //TODO should we move it from here
                    await webix.promise.all(
                        [config.device.fetchCommands(),
                            config.device.fetchAttrs()]).then(() => this.config.device.pollStatus());

                    this.$$commands = this.$$('commands');
                    this.$$attributes = this.$$('attributes');

                    // this.$$attributes.data.sync(this.config.device.attrs);
                    this.$$commands.update();
                    this.$$attributes.update();
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
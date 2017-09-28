/** @module TestDevicePanel */
(function () {
    var test_device_commands = webix.protoUI({
        name: 'device_panel_commands',
        _synchronize: function (device) {
            TangoWebappHelpers.debug("device[" + device.id + "].commands.count=" + device.commands.count());
            if (!device.commands.count()) {
                this.showProgress({
                    type: "icon"
                });
                device.fetchCommands().then(function (commands) {
                    this.hideProgress();
                }.bind(this))
            }
            this.$$('list').data.sync(device.commands);
        },
        _execute_command: function () {
            debugger
        },
        _ui: function () {
            return {
                rows: [
                    {
                        view: 'list',
                        id: 'list',
                        select: true,
                        template: "#name#"
                    },
                    {
                        id: 'form',
                        view: 'form',
                        complexData: true,
                        elements: [
                            {
                                view: 'text',
                                name: 'argin'
                            },
                            {
                                cols: [
                                    {
                                        view: 'text',
                                        name: 'info.in_type',
                                        label: 'Argin type:'
                                    },
                                    {
                                        view: 'text',
                                        name: 'info.out_type',
                                        label: 'Argout type'
                                    }
                                ]
                            },
                            {
                                cols: [
                                    {
                                        view: 'text',
                                        name: 'info.in_type_desc'
                                    },
                                    {
                                        view: 'text',
                                        name: 'info.out_type_desc'
                                    }
                                ]
                            },
                            {
                                view: 'button',
                                name: 'btnExecCmd',
                                value: 'Execute',
                                disabled: true,
                                click: function () {
                                    this.getTopParentView()._execute_command();
                                }
                            }
                            //,
                            //{
                            //    view: 'button',
                            //    name: 'btnPlotCmd',
                            //    disabled: true,
                            //    value: 'Plot',
                            //    click: function () {
                            //        this.getTopParentView().plotCommand();
                            //    }
                            //}
                        ]
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.$$('form').bind(this.$$('list'))
            }.bind(this));
        },
        defaults: {}

    }, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

    var test_device_panel = webix.protoUI({
        name: 'test_device_panel',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'clean',
                        id: 'device',
                        height: 30,
                        //TODO align center
                        complexData: true,
                        template: 'Device[<span class="webix_strong">#name#</span>] exported = #info.exported#',
                        on: {
                            onBindRequest: function () {
                                var top = this.getTopParentView();
                                var device = this.data;
                                if (!device.id || device.id == 'unknown' || !device.info.exported) {
                                    top.disable();
                                    return;
                                }

                                top.$$('commands')._synchronize(device);
                                top.enable();
                            }
                        }
                    },
                    {
                        view: 'device_panel_commands',
                        id: 'commands'
                    },
                    {
                        template: 'body'
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('device').bind(config.context.devices);
            }.bind(this));
        },
        defaults: {
            disabled: true,
            on: {}
        }
    }, webix.IdSpace, webix.ui.layout)
})();
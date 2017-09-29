/** @module TestDevicePanel */
(function () {
    /**
     *
     *
     * @type {{_what: string, synchronize: function, $init: function}}
     */
    var synchronizer = {
        _what: null,
        _command: null,
        synchronize: function (device) {
            TangoWebappHelpers.debug("device[" + device.id + "]." + this._what + ".count=" + device[this._what].count());
            if (!device[this._what].count()) {
                this.showProgress({
                    type: "icon"
                });
                device[this._command]().then(function () {
                    this.hideProgress();
                }.bind(this))
            }
            this.$$('list').data.sync(device[this._what]);
        },
        $init: function (config) {
            this._what = config.id;
            this._command = 'fetch' + MVC.String.classize(this._what);
        }
    };

    var test_device_commands = webix.protoUI({
        name: 'device_panel_commands',
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
                                //TODO replace with tooltips
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

    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

    var test_device_attributes = webix.protoUI({
        name: 'device_panel_attributes',
        _read: function () {
            debugger
        },
        _write: function () {
            debugger
        },
        _plot: function () {
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
                        //dataFeed: '...',
                        elements: [
                            {
                                view: 'text',
                                name: 'argin'
                            },
                            {
                                view: "textarea",
                                name: "info"
                            },
                            {
                                cols: [{
                                    view: 'button',
                                    name: 'btnRead',
                                    value: 'Read',
                                    disabled: true,
                                    click: function () {
                                        this.getTopParentView()._read();
                                    }
                                },
                                    {
                                        view: 'button',
                                        name: 'btnWrite',
                                        disabled: true,
                                        value: 'Write',
                                        click: function () {
                                            this.getTopParentView()._write();
                                        }
                                    },
                                    {
                                        view: 'button',
                                        name: 'btnPlot',
                                        disabled: true,
                                        value: 'Plot',
                                        click: function () {
                                            this.getTopParentView()._plot();
                                        }
                                    }]
                            }
                        ],
                        on: {
                            onBindApply: function (obj, dummy, master) {
                                if (!obj) return this.clear();

                                //TODO fetch from server
                                this.elements['info'].setValue(_attribute_info.render(obj));
                                this.elements['btnRead'].enable();
                                if (obj.writable.includes("WRITE"))
                                    this.elements['btnWrite'].enable();
                                else
                                    this.elements['btnWrite'].disable();
                                if (obj.data_format === 'SPECTRUM' || obj.data_format === 'IMAGE') {
                                    this.elements['btnPlot'].enable();
                                } else {
                                    this.elements['btnPlot'].disable();
                                }
                            }
                        }
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.$$('form').bind(this.$$('list'))
            }.bind(this));
        }
    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

    var test_device_pipes = webix.protoUI({
        name: 'device_panel_pipes',
        _read: function () {
            debugger
        },
        _write: function () {
            debugger
        },
        _help: function () {
            debugger
        },
        _ui: function (context) {
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
                        //dataFeed: '...',
                        elements: [
                            {
                                view: 'textarea',
                                name: 'argin'
                            },
                            {
                                cols: [
                                    {
                                        view: 'button',
                                        name: 'btnRead',
                                        value: 'Read',
                                        disabled: true,
                                        click: function () {
                                            this.getTopParentView()._read();
                                        }
                                    },
                                    {
                                        view: 'button',
                                        name: 'btnWrite',
                                        disabled: true,
                                        value: 'Write',
                                        click: function () {
                                            this.getTopParentView()._write();
                                        }
                                    }
                                ]
                            }
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
        }
    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

    var device_panel_header = {
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

                top.$$('commands').synchronize(device);
                //TODO rename MVC.Class.attributes to anything
                top.$$('attrs').synchronize(device);
                top.$$('pipes').synchronize(device);
                top.enable();
            }
        }
    };

    var test_device_panel = webix.protoUI({
        name: 'test_device_panel',
        _ui: function (context) {
            return {
                rows: [
                    device_panel_header,
                    {
                        view: "tabview",
                        gravity: 3,
                        cells: [
                            {
                                header: "Commands",
                                body: {
                                    view: 'device_panel_commands',
                                    id: 'commands',
                                    context: context
                                }
                            },
                            {
                                header: "Attributes",
                                body: {
                                    view: 'device_panel_attributes',
                                    id: 'attrs',
                                    context: context
                                }
                            },
                            {
                                header: "Pipes",
                                body: {
                                    view: 'device_panel_pipes',
                                    id: 'pipes',
                                    context: context
                                }
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        template: 'output'
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui(config.context));

            this.$ready.push(function () {
                this.$$('device').bind(config.context.devices);
            }.bind(this));
        },
        defaults: {
            disabled: true,
            on: {
                "platform_context.create subscribe": function (event) {
                    event.controller.$$('device').bind(event.data.devices);
                },
                "platform_context.destroy subscribe": function (event) {
                    //TODO clean values
                    event.controller.disable();
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout)
})();
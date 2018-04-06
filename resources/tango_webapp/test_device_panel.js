/** @module TestDevicePanel */
(function () {
    /**
     * @type {webix.ui.config}
     */
    var synchronizer = {
        _what: null,
        _command: null,
        synchronize: function (device) {
            TangoWebappHelpers.debug("device[" + device.id + "]." + this._what + ".count=" + device[this._what].count());
            //TODO move this logic to devices_tree (when user clicks on a device)
            if (!device[this._what].count()) {
                this.showProgress({
                    type: "icon"
                });
                device[this._command]().then(function () {
                    this.hideProgress();
                }.bind(this))
            }
            this.$$('list').data.sync(device[this._what]);
            this.elements.name.setValue('');//drop currently selected item
        },
        $init: function (config) {
            this._what = config.id;
            this._command = 'fetch' + MVC.String.classize(this._what);
        }
    };

    /**
     * @type {webix.protoUI}
     */
    var test_device_commands = webix.protoUI({
        name: 'device_panel_commands',
        _execute_command: function () {
            var command = this.$$('list').getSelectedItem();
            var argin = this.elements.argin.getValue();
            command.execute(argin)
                .fail(error_handler.bind(this))
                .then(function (resp) {
                    if (!resp.output) resp.output = "";
                    this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_command_out.ejs'}).render(resp));
                }.bind(this));
        },
        _ui: function () {
            return {
                elements: [
                    filter,
                    {
                        view: 'list',
                        id: 'list',
                        select: true,
                        template: "#name#"
                    },
                    {
                        view: 'text',
                        type: 'hidden',
                        height: 2,
                        name: 'name',
                        validate: webix.rules.isNotEmpty,
                        invalidMessage: 'Command must be selected from the list'
                    },
                    {
                        view: 'text',
                        name: 'argin',
                        placeholder: 'Input e.g. 3.14 or [3.14, 2.87] etc'
                        //TODO argin converter
                    },
                    {
                        cols: [
                            {
                                view: 'text',
                                name: 'info.in_type',
                                label: 'Argin: ',
                                labelWidth: 50,
                                tooltip: '' //set when onBindRequest
                            },
                            {
                                view: 'text',
                                name: 'info.out_type',
                                label: 'Argout:',
                                labelWidth: 50,
                                tooltip: '' //set when onBindRequest
                            }
                        ]
                    },
                    {
                        view: 'button',
                        name: 'btnExecCmd',
                        value: 'Execute',
                        click: function () {
                            var form = this.getFormView();
                            if (form.validate()) {
                                form._execute_command();
                            }
                        }
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.bind(this.$$('list'))
            }.bind(this));
        },
        defaults: {
            complexData: true,
            on: {
                onBindApply: function () {
                    var command = this.$$('list').getSelectedItem();
                    if (!command) return;

                    this.clearValidation();

                    this.elements['info.in_type'].define('tooltip', command.info.in_type_desc);
                    this.elements['info.out_type'].define('tooltip', command.info.out_type_desc);

                    if (command.info.in_type !== 'DevVoid') {
                        this.elements.argin.define({
                            validate: webix.rules.isNotEmpty,
                            invalidMessage: 'Input argument can not be empty'
                        });
                    } else {
                        this.elements.argin.define({validate: '', invalidMessage: 'Input argument can not be empty'});
                    }
                }
            }
        }
    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    var filter = {
        view: 'text',
        value: '',
        placeholder: 'type to filter',
        label: '<span class="webix_icon fa-filter"></span>',
        labelWidth: 20,
        on: {
            onTimedKeyPress: function () {
                this.getFormView().$$("list").filter("#name#", this.getValue());
            }
        }
    };

    //TODO make instance functions
    var openTab = function (view, resp) {
        var $$tab = $$(this.id);
        if (!$$tab) {
            $$("main-tabview").addView(view);
            $$tab = $$(this.id);
        }

        $$tab.show();
        $$tab.update(resp);
    };

    //TODO send Open Ajax event and handle it in main_controller
    var openSpectrumWindow = function (resp) {
        this.value = resp;
        openTab.bind(this)({
            header: "<span class='webix_icon fa-area-chart'></span>[<span class='webix_strong'>" + this.device_id + '/' + this.name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newSpectrumView(this)
        }, resp);
    };

    //TODO send Open Ajax event and handle it in main_controller
    var openImageWindow = function (resp) {
        openTab.bind(this)({
            header: "<span class='webix_icon fa-image'></span>[<span class='webix_strong'>" + this.device_id + '/' + this.name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newImageView(webix.extend({id: this.id}, resp))
        }, resp);
    };

    var openScalarWindow = function(resp) {
        openTab.bind(this)({
            header: "<span class='webix_icon fa-image'></span>[<span class='webix_strong'>" + this.device_id + '/' + this.name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newScalarView(webix.extend({id: this.id}, resp))
        }, resp)
    };

    var error_handler = function (resp) {
        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_error_out.ejs'}).render(resp))
    };

    /**
     * @type {webix.protoUI}
     */
    var test_device_attributes = webix.protoUI({
        name: 'device_panel_attributes',
        _read: function () {
            var attribute = this.$$('list').getSelectedItem();


            attribute.read()
                .fail(error_handler.bind(this))
                .then(function (resp) {
                    this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_attribute_out.ejs'}).render(resp))
                }.bind(this));
        },
        _write: function () {
            var attribute = this.$$('list').getSelectedItem();

            var v = this.elements.w_value.getValue();

            attribute.write(v)
                .fail(error_handler.bind(this))
                .then(function (resp) {
                    this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_attribute_out.ejs'}).render(resp))
                }.bind(this));
        },
        _plot: function () {
            var attribute = this.$$('list').getSelectedItem();

            if (attribute.info.data_format === "SPECTRUM") {
                attribute.read()
                    .fail(error_handler.bind(this))
                    .then(openSpectrumWindow.bind(attribute));
            } else if (attribute.info.data_format === "IMAGE") {
                attribute.read()
                    .fail(error_handler.bind(this))
                    .then(openImageWindow.bind(attribute));
            } else if (attribute.info.data_format === "SCALAR") {
                attribute.read()
                    .fail(error_handler.bind(this))
                    .then(openScalarWindow.bind(attribute));
            } else {
                TangoWebappHelpers.error("Unsupported data format: " + attribute.info.data_format);
            }
        },
        _ui: function () {
            return {
                elements: [
                    filter,
                    {
                        view: 'list',
                        id: 'list',
                        select: true,
                        template: "#name#"
                    },
                    {
                        view: 'text',
                        type: 'hidden',
                        height: 2,
                        name: 'name',
                        validate: webix.rules.isNotEmpty,
                        invalidMessage: 'Attribute must be selected from the list'
                    },
                    {
                        view: 'text',
                        name: 'w_value'
                    },
                    {
                        view: "textarea",
                        name: "info"
                    },
                    {
                        cols: [
                            {
                                view: 'button',
                                name: 'btnRead',
                                value: 'Read',
                                click: function () {
                                    var form = this.getFormView();
                                    if (form.validate()) {
                                        form._read();
                                    }
                                }
                            },
                            {
                                view: 'button',
                                name: 'btnWrite',
                                disabled: true,
                                value: 'Write',
                                click: function () {
                                    var form = this.getFormView();
                                    if (form.validate()) {
                                        form._write();
                                    }
                                }
                            },
                            {
                                view: 'button',
                                name: 'btnPlot',
                                disabled: true,
                                value: 'Plot',
                                click: function () {
                                    var form = this.getFormView();
                                    if (form.validate()) {
                                        form._plot();
                                    }
                                }
                            }]
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.bind(this.$$('list'))
            }.bind(this));
        },
        defaults: {
            on: {
                onBindApply: function (obj, dummy, master) {
                    if (!obj) return this.clear();

                    var info;
                    try {
                        info = new View({url: 'views/dev_panel_attribute_info.ejs'}).render(obj.info);
                    } catch (e) {
                        info = "Failed to parse attribute.info: " + e;
                    }
                    this.elements.info.setValue(info);
                    this.elements['btnPlot'].enable();
                    if (obj.info.writable.includes("WRITE"))
                        this.elements['btnWrite'].enable();
                    else
                        this.elements['btnWrite'].disable();
                }
            }
        }
    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    /**
     * @type {webix.protoUI}
     */
    var test_device_pipes = webix.protoUI({
        name: 'device_panel_pipes',
        _read: function () {
            var pipe = this.$$('list').getSelectedItem();

            pipe.read()
                .fail(error_handler.bind(this))
                .then(function (resp) {
                    this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_pipe_out.ejs'}).render(resp));
                }.bind(this))

        },
        _write: function () {
            var pipe = this.$$('list').getSelectedItem();

            var input;
            try {
                input = JSON.parse(this.elements.input.getValue())
            } catch (e) {
                TangoWebappHelpers.error(e);
            }

            pipe.write(input)
                .fail(error_handler.bind(this))
                .then(function (resp) {
                    this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_pipe_out.ejs'}).render(resp));
                }.bind(this))
        },
        _ui: function () {
            return {
                elements: [
                    filter,
                    {
                        view: 'list',
                        id: 'list',
                        select: true,
                        template: "#name#"
                    },
                    {
                        view: 'text',
                        type: 'hidden',
                        height: 2,
                        name: 'name',
                        validate: webix.rules.isNotEmpty,
                        invalidMessage: 'Pipe must be selected from the list'
                    },
                    {
                        view: 'textarea',
                        name: 'input'
                        //TODO code highlight
                    },
                    {
                        cols: [
                            {
                                view: 'button',
                                name: 'btnRead',
                                value: 'Read',
                                click: function () {
                                    var form = this.getFormView();
                                    if (form.validate()) {
                                        form._read();
                                    }
                                }
                            },
                            {
                                view: 'button',
                                name: 'btnWrite',
                                value: 'Write',
                                click: function () {
                                    var form = this.getFormView();
                                    if (form.validate()) {
                                        form._write();
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.bind(this.$$('list'))
            }.bind(this));
        }
    }, synchronizer, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    /**
     *
     * @type {webix.ui.config}
     */
    var device_panel_header = {
        type: 'clean',
        id: 'device',
        height: 30,
        //TODO align center
        complexData: true,
        template: '[<span class="webix_strong">#display_name#@#host.id#</span>]',
        on: {
            onBindApply: function (obj) {
                var top = this.getTopParentView();
                var device = obj;
                if (!device || !device.id || device.id === undefined || !device.info.exported) {
                    top.disable();
                    return;
                }

                top.$$('commands').synchronize(device);
                top.$$('attrs').synchronize(device);
                top.$$('pipes').synchronize(device);
                top.enable();
            }
        }
    };

    /**
     * @type {webix.protoUI}
     */
    var test_device_panel = webix.protoUI({
        name: 'test_device_panel',
        clearAll: function () {
            //TODO
            this.$$('commands').clearAll();
            this.$$('attrs').clearAll();
            this.$$('pipes').clearAll();
        },
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
                        view: 'textarea',
                        id: 'output'
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
                "platform_api.ui.initialized subscribe": function (event) {
                    TangoWebappHelpers.debug('test_device_panel.platform_context.create subscribe');
                    event.controller.$$('device').bind(event.data.context.devices);
                },
                "platform_context.destroy subscribe": function (event) {
                    TangoWebappHelpers.debug('test_device_panel.platform_context.destroy subscribe');
                    event.controller.$$('device').unbind();
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout)
})();
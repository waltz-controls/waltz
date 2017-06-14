webix.protoUI({
    _getUI: function(){
        return {
            cols: [
                {
                    view: "list",
                    id: 'commands-list',
                    select: true,
                    template: "#name#"
                },
                {
                    id: 'frm',
                    view: 'form',
                    complexData:true,
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
                                this.getTopParentView().executeCommand();
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
        }
    },
    name: "DevPanelCommands",
    $init: function (config) {
        webix.extend(config, this._getUI());

        this.$ready.push(function () {
            this.$$('frm').bind(this.$$('commands-list'), '$data', function (cmd, cmds) {
                if (!cmd) return this.clear();
                if (webix.debug_bind) webix.message("Requesting data for cmd " + cmd.name);
                this.parse(config.device.commandInfo(cmd.name));
                this.elements['btnExecCmd'].enable();
                //this.elements['btnPlotCmd'].enable(); //TODO enable conditionally
            })
        });
        this.$ready.push(function () {
            this.$$('commands-list').parse(this._device.commands());
        });
    },
    _command: new View({url: 'views/dev_panel_command_out.ejs'}),
    executeCommand: function () {
        var o = this.$$('frm').getValues();

        this._device.executeCommand(o.name, o.argin).then(this.getTopParentView().updateLog.bind(this, this._command ));
    },
    plotCommand:function(){
        var o = this.$$('frm').getValues();
        var device = this._device;
            this._device.executeCommand(o.cmd_name, o.argin).then(
                function (resp) {
                    webix.ui(
                        {
                            view: 'Plot',
                            name: device.name + '/' + resp.name,
                            data: resp.output
                        }).show();
                }
            );

    },
    defaults: {

    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

webix.protoUI({
    _getUI: function(){
        var _attribute_info = new View({url: 'views/dev_panel_attribute_info.ejs'});
        var top = this;
        return {
            cols: [
                {
                    view: "list",
                    id: 'attributes-list',
                    select: true,
                    template: "#name#"
                },
                {
                    id: 'frm',
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
                                click: top.readAttribute.bind(top)
                            },
                                {
                                    view: 'button',
                                    name: 'btnWrite',
                                    disabled: true,
                                    value: 'Write',
                                    click: top.writeAttribute.bind(top)
                                },
                                {
                                    view: 'button',
                                    name: 'btnPlot',
                                    disabled: true,
                                    value: 'Plot',
                                    click: top.plotAttribute.bind(top)
                                }]
                        }
                    ],
                    on: {
                        onBindApply: function(obj, dummy, master){
                            if(!obj) return this.clear();

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
    name: "DevPanelAttributes",
    $init: function (config) {
        webix.extend(config, this._getUI());

        this.$ready.push(function () {
            this.$$('attributes-list').sync(this._device.attributeInfoCollection);

            this.$$('frm').bind(this.$$('attributes-list'));
        });
        //force refresh
        this.$ready.push(config.device.attributesInfo.bind(config.device));
    },
    _out: new View({url: 'views/dev_panel_attribute_out.ejs'}),
    readAttribute: function () {
        var o = this.$$('attributes-list').getSelectedItem();
        var main = this.getTopParentView();
        this._device.readAttribute(o.name).then(main.updateLog.bind(main, this._out));
    },
    writeAttribute: function () {
        var argin = this.$$('frm').elements['argin'].getValue();
        var o = this.$$('attributes-list').getSelectedItem();

        var main = this.getTopParentView();
        this._device.writeAttribute(o.name, argin).then(main.updateLog.bind(main, this._out));
    },
    plotAttribute: function () {
        var o = this.$$('attributes-list').getSelectedItem();

        if (o.data_format == "SPECTRUM") {
            this._device.readAttribute(o.name).then(TangoWebapp.helpers.openSpectrumWindow);
        } else if (o.data_format == "IMAGE") {
            this._device.readAttribute(o.name).then(TangoWebapp.helpers.openImageWindow);
        } else {
            TangoWebapp.error("Unsupported data format: " + o.data_format);
        }
    },
    defaults: {
    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

webix.protoUI({
    name: "DevPanelPipes",
    $init: function (config) {
        this.$ready.push(function () {
            this.$$('frm').bind(this.$$('pipes-list'), '$data', function (pipe, cmds) {
                if (!pipe) return this.clear();
                if (webix.debug_bind) webix.message("Requesting data for pipe " + pipe.name);
                this.elements['btnRead'].enable();
                this.elements['btnWrite'].enable();
            })
        });
        this.$ready.push(function () {
            this.$$('pipes-list').parse(this._device.pipes());
        });
    },
    _output: new View({url: 'views/dev_panel_pipe_out.ejs'}),
    readPipe: function () {
        var o = this.$$('pipes-list').getSelectedItem();

        this._device.readPipe(o.name).then(this.getTopParentView().updateLog.bind(this.getTopParentView(), this._output));
    },
    writePipe:function(){
        var pipe = this.$$('pipes-list').getSelectedItem();
        var argin = JSON.parse(this.$$('frm').getValues().argin);

        this._device.writePipe(pipe.name, argin).then(this.getTopParentView().updateLog.bind(this.getTopParentView(), this._output));
    },
    defaults: {
        cols: [
            {
                view: "list",
                id: 'pipes-list',
                select: true,
                template: "#name#"
            },
            {
                id: 'frm',
                view: 'form',
                //dataFeed: '...',
                elements: [
                    {
                        view: 'textarea',
                        name: 'argin'
                    },
                    {
                        view: 'button',
                        name: 'btnRead',
                        value: 'Read',
                        disabled: true,
                        click: function () {
                            this.getTopParentView().readPipe();
                        }
                    },
                    {
                        view: 'button',
                        name: 'btnWrite',
                        disabled: true,
                        value: 'Write',
                        click: function () {
                            this.getTopParentView().writePipe();
                        }
                    },
                    {
                        view: 'button',
                        name: 'btnHelp',
                        disabled: true,
                        value: 'Help',
                        click: function () {
                            this.getTopParentView().help();
                        }
                    }
                ]
            }
        ]
    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

webix.protoUI({
    name: "DevicePanel",
    getBody: function (device) {
        return {
            body: {
                view: "layout",
                rows: [
                    {
                        view: "tabview",
                        cells: [
                            {
                                header: "Commands",
                                body: {
                                    view: "DevPanelCommands",
                                    device: device
                                }
                            },
                            {
                                header: "Attributes",
                                body: {
                                    view: "DevPanelAttributes",
                                    device: device
                                }
                            },
                            {
                                header: "Pipes",
                                body: {
                                    view: "DevPanelPipes",
                                    device: device
                                }
                            //},
                            //{
                            //    header: "Admin",
                            //    body: {
                            //        template: "Admin body"
                            //    }
                            }
                        ]
                    },
                    {view: "resizer"},
                    {
                        id: 'tmpLog',
                        view: "textarea"
                    },
                    {
                        view: "toolbar",
                        cols: [
                            {
                                view: "button", id: "btnClear", value: "Clear history", width: 100, align: "right",
                                click: function () {
                                    this.getTopParentView().$$('tmpLog').setValue('');
                                }
                            },
                            {
                                view: "button",
                                id: "btnDismiss",
                                value: "Close",
                                width: 100,
                                align: "right",
                                click: function () {
                                    this.getTopParentView().close()
                                }
                            }]
                    }

                ]
            }
        };
    },
    $init: function (config) {
        webix.extend(config, this.getBody(config.device));

        this.$ready.push(function () {
            this.getHead().setValues({name: this._device.name});
        })
    },
    updateLog: function (out, val) {
        var log = this.getTopParentView().$$('tmpLog');
        log.setValue(log.getValue() + "\n" + out.render(val));//TODO append
    },
    defaults: {
        head: {template: "Device panel [#name#]"},
        position: "center",
        move: true,
        height: 640,
        width: 720,
        on: {
            //onHide:this.close
        }
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.mixin.DeviceSetter, webix.ui.window);
/**
 * This module contains two panels related to tango device: info panel and control panel.
 *
 * Info panel is responsible for displaying device's info as datatable and commands, attributes and pipes as lists
 *
 * Control panel executes commands; reads, writes attributes and pipes
 *
 * @module DeviceViewPanel
 * @memberof ui
 */
(function(){
    /**
     * @constant
     * @type {string}
     * @memberof ui.DeviceViewPanel
     */
    var kDevicePanelHeader = "<span class='webix_icon fa-microchip'></span> Device: ";
    /**
     * @constant
     * @type {string}
     * @memberof ui.DeviceViewPanel
     */
    var kDeviceControlPanelHeader = "<span class='webix_icon fa-keyboard-o'></span> Control Panel";

    var device_info_values = [
        "name",
        "admin",
        "device_class",
        "exported",
        "host",
        "idl",
        "pid",
        "started_at",
        "stopped_at"
    ];

    var device_info_parser = function(device){
        if (device.id === undefined) return false;
        function get_device_info(device){
            var result = [];

            result.push({
                info: 'Alias',
                value: device.display_name
            });

            device_info_values.forEach(function(item){
                result.push({
                    info: MVC.String.classize(item),
                    value: device.info[item]
                })
            });

            return result;
        }

        var info = get_device_info(device);
        this.clearAll();
        this.parse(info);

        $$("device_tree").config.header = webix.template(function () {
            return kDevicePanelHeader + device.display_name;
        });
        $$("device_tree").refresh();
    };

    var filter = function (id) {
        return {
            view: 'text',
            value: '',
            placeholder: 'type to filter',
            label: '<span class="webix_icon fa-filter"></span>',
            labelWidth: 20,
            on: {
                onTimedKeyPress: function () {
                    this.getTopParentView().$$(id).filter("#name#", this.getValue());
                }
            }
        }
    };

    /**
     * More info: {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
     * @augments webix.ui.list
     * @name DeviceTreeList
     * @type {protoUI}
     * @memberof ui.DeviceViewPanel
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DeviceTreeList = webix.protoUI(
        {
            name: 'device_tree_list',
            $init:function(config){
            },
            defaults: {
                select: true,
                drag: "source",
                template: function(obj){
                    return "<span class='webix_icon "+ obj.getIcon() + "'></span>"+ obj.display_name;
                },
                on: {
                    /**
                     *
                     * @param device
                     * @return {boolean}
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onBindApply: function (device) {
                        if (device.id === undefined) return false;
                        this.clearAll();
                        this.showProgress({
                            type: 'icon'
                        });
                        device["fetch" + MVC.String.classize(this.config.$id)]()
                            .fail(function(err){
                                if(err.errors && err.errors[0].reason === 'TangoApi_NOT_SUPPORTED') return [];
                                else throw err;
                            })
                            .then(function () {
                            return device;
                        })
                            .then(function(device){
                                this.data.importData(device[this.config.$id]);
                                this.sort("#display_name#", "asc", "string");
                                this.hideProgress();
                            }.bind(this));
                    },
                    /**
                     * Fires {@link event:item_selected}
                     *
                     * @fires item_selected
                     * @param {string} id
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onAfterSelect: function (id) {
                        /**
                         * @event tango_webapp.item_selected
                         * @type {OpenAjax}
                         * @property {{id:string,kind:string}} data
                         * @memberof ui
                         */
                        OpenAjax.hub.publish("tango_webapp.item_selected", {
                            data: {
                                id: id,
                                kind: this.config.$id
                            }
                        });
                    },
                    /**
                     * Expands DeviceControlPanel
                     *
                     * @param id
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onItemDblClick:function(id){
                        $$('device_control_panel_header').expand()
                    }
                }
            }
        }, webix.ProgressBar, webix.ui.list);

    /**
     * See {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.layout}
     * 
     * @augments webix.ui.layout
     * @memberof ui.DeviceViewPanel
     * @name DeviceInfoPanel
     * @type {protoUI}
     * @property {info_datatable} info
     * @property {DeviceTreeList} commands
     * @property {DeviceTreeList} attrs
     * @property {DeviceTreeList} pipes
     * @see {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.layout}
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DeviceInfoPanel = webix.protoUI({
        name: 'device_info_panel',
        _ui:function(){
            return {
                rows:[
                    TangoWebapp.ui.newInfoDatatable(device_info_parser),
                    {
                        view: "tabview",
                        gravity: 2,
                        cells: [
                            {
                                header: "Commands",
                                body: {
                                    rows:[
                                        filter('commands'),
                                        {
                                            id:'commands',
                                            view:'device_tree_list'
                                        }
                                    ]
                                }
                            },
                            {
                                header: "Attributes",
                                body: {
                                    rows:[
                                        filter('attrs'),
                                        {
                                            id:'attrs',
                                            view:'device_tree_list'
                                        }
                                    ]
                                }
                            },
                            {
                                header: "Pipes",
                                body: {
                                    rows:[
                                        filter('pipes'),
                                        {
                                            id:'pipes',
                                            view:'device_tree_list'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        },
        $init:function(config){
            webix.extend(config, this._ui());
            this.$ready.push(function(){
                this.$$('info').bind(config.context.devices);
                this.$$('commands').bind(config.context.devices);
                this.$$('attrs').bind(config.context.devices);
                this.$$('pipes').bind(config.context.devices);
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.layout);

    var attr_info_values = [
        'label','writable','data_format','data_type','max_dim_x','max_dim_y','unit','standard_unit',
        'display_unit','format','min_value','max_value'];

    var attr_info_datatable = {
        id: 'info',
        view: 'datatable',
        header:false,
        columns:[
            {id:'info' },
            {id:'value', fillspace: true}
        ],
        on:{
            onBindApply:function(attr){
                if(!attr) return false;
                var info = [];
                info.push({info:'Name', value: attr.name});
                attr_info_values.forEach(function(el){
                    info.push({info:MVC.String.classize(el), value: attr.info[el]})
                });
                this.clearAll();
                this.parse(info);
            }
        }
    };

    var commands_info_datatable = {
        view: 'form',
        id: 'info',
        elements:[{
            cols: [{
                view:'fieldset',
                label: 'Input',
                body:{
                    rows:[
                        {
                            view: 'label',
                            name:'in_type'
                        },
                        {
                            view: 'textarea',
                            name:'in_type_desc'
                        }
                    ]
                }
            },
                {
                    view:'fieldset',
                    label: 'Output',
                    body:{
                        rows:[
                            {
                                view: 'label',
                                name:'out_type'
                            },
                            {
                                view: 'textarea',
                                name:'out_type_desc'
                            }
                        ]
                    }
                }]
        }
        ],
        on:{
            onBindApply:function(cmd){
                if(!cmd) return false;
                this.setValues(cmd.info);
            }
        }
    };

    /**
     * More info: {@link https://docs.webix.com/api__refs__ui.view.html webix.ui.view}
     * @augments webix.ui.view
     * @memberof ui.DeviceViewPanel
     * @name DevicePanelEmpty
     * @type {protoUI}
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DevicePanelEmpty = webix.protoUI({
        name:"device_panel_empty",
        $init:function(){
        }
    },  webix.ProgressBar, webix.ui.view);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @augments webix.ui.form
     * @memberof ui.DeviceViewPanel
     * @name DevicePanelCommands
     * @type {protoUI}
     * @property {TangoCommand} command
     * @property {commands_info_datatable} info
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DevicePanelCommands = webix.protoUI(
        {
            command: null,
            name: 'device_panel_commands',
            _execute_command: function () {
                var command = this.command;

                var argin = this.elements.argin.getValue();

                UserAction.executeCommand(command, argin)
                    .then(function (resp) {
                        if (!resp.output) resp.output = "";
                        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_command_out.ejs'}).render(resp));
                    }.bind(this))
                    .fail(error_handler.bind(this));
            },
            _ui: function () {
                return {
                    elements: [
                        commands_info_datatable,
                        {
                            view: 'text',
                            name: 'argin',
                            placeholder: 'Input e.g. 3.14 or [3.14, 2.87] etc'
                            //TODO argin converter
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
            /**
             *
             * @param {TangoCommand} command
             * @memberof ui.DeviceViewPanel.DevicePanelCommands
             */
            setCommand:function(command){
                this.clearValidation();
                this.command = command;

                if (command.info.in_type !== 'DevVoid') {
                    this.elements.argin.define({
                        validate: webix.rules.isNotEmpty,
                        invalidMessage: 'Input argument can not be empty'
                    });
                } else {
                    this.elements.argin.define({validate: '', invalidMessage: 'Input argument can not be empty'});
                }

                this.$$('info').setValues(command.info);
            },
            /**
             * @constructs DevicePanelCommands
             * @memberof ui.DeviceViewPanel.DevicePanelCommands
             */
            $init: function (config) {
                webix.extend(config, this._ui());
                this.$ready.push(function () {
                    this.bind($$('device_info_panel').$$('commands'));
                }.bind(this));
            },
            defaults: {
                complexData: true,
                on: {
                    /**
                     *
                     * @param {TangoCommand} command
                     * @memberof ui.DeviceViewPanel.DevicePanelCommands
                     */
                    onBindApply: function (command) {
                        if (!command) return;

                        this.setCommand(command);
                    }
                }
            }
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    //TODO make instance functions
    var openTab = function (view, resp) {
            var $$tab = $$(this.id);
            if (!$$tab) {
                var device = PlatformContext.devices.getItem(this.device_id);
                PlatformApi.PlatformUIController().openTangoHostTab(device.host, view);

                $$tab = $$(this.id);
            }

            $$tab.show();
            $$tab.update(resp);
        };

    //TODO send Open Ajax event and handle it in main_controller
    var openSpectrumWindow = function (resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: "<span class='webix_icon fa-area-chart'></span>[<span class='webix_strong'>" + device.display_name + '/' + this.display_name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newSpectrumView(this)
        }, resp);
    };

    //TODO send Open Ajax event and handle it in main_controller
    var openImageWindow = function (resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: "<span class='webix_icon fa-image'></span>[<span class='webix_strong'>" + device.display_name + '/' + this.display_name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newImageView(webix.extend({id: this.id}, resp))
        }, resp);
    };

    var openScalarWindow = function(resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: "<span class='webix_icon fa-at'></span>[<span class='webix_strong'>" + device.display_name + '/' + this.display_name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newScalarView(webix.extend({id: this.id}, resp))
        }, resp)
    };

    var attr_output_handler = function (resp) {
        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_attribute_out.ejs'}).render(resp));
    };

    var error_handler = function (resp) {
        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_error_out.ejs'}).render(resp));
        //clear errors
        resp.errors.length = 0;
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @augments webix.ui.form
     * @memberof ui.DeviceViewPanel
     * @name DevicePanelAttributes
     * @type {protoUI}
     * @property {TangoAttribute} attr -- set in TODO method link onBindApply
     * @property {attr_info_datatable} info
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DevicePanelAttributes = webix.protoUI(
        {
            attr: null,
            name: 'device_panel_attributes',
            _read: function () {
                UserAction.readAttribute(this.attr)
                    .then(attr_output_handler.bind(this))
                    .fail(error_handler.bind(this));
            },
            _write: function () {
                var v = this.elements.w_value.getValue();

                UserAction.writeAttribute(this.attr, v)
                    .then(attr_output_handler.bind(this))
                    .fail(error_handler.bind(this));

            },
            _plot: function () {
                if (this.attr.info.data_format === "SPECTRUM") {
                    UserAction.readAttribute(this.attr)
                        .then(openSpectrumWindow.bind(this.attr))
                        .fail(error_handler.bind(this));
                } else if (this.attr.info.data_format === "IMAGE") {
                    UserAction.readAttribute(this.attr)
                        .then(openImageWindow.bind(this.attr))
                        .fail(error_handler.bind(this));
                } else if (this.attr.info.data_format === "SCALAR") {
                    UserAction.readAttribute(this.attr)
                        .then(openScalarWindow.bind(this.attr))
                        .fail(error_handler.bind(this));
                } else {
                    TangoWebappHelpers.error("Unsupported data format: " + this.attr.info.data_format);
                }
            },
            _plot_history:function(){
                UserAction.readAttributeHistory(this.attr)
                    .then(function(attr){
                        attr.value = attr.history.pop();
                        return attr;
                    })
                    .then(openScalarWindow.bind(this.attr))
                    .then(function(){
                        var $$plot = $$(this.attr.id);
                        $$plot.updateMulti(this.attr.history);
                    }.bind(this))
                    .fail(error_handler.bind(this));
            },
            _ui: function () {
                return {
                    elements: [
                        attr_info_datatable,
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
                                    name: 'btnPlot',
                                    disabled: true,
                                    value: 'Plot',
                                    click: function () {
                                        var form = this.getFormView();
                                        if (form.validate()) {
                                            form._plot();
                                        }
                                    }
                                },
                                {
                                    view: 'button',
                                    name: 'btnPlotHist',
                                    disabled: true,
                                    value: 'Plot.Hist',
                                    click: function () {
                                        var form = this.getFormView();
                                        if (form.validate()) {
                                            form._plot_history();
                                        }
                                    }
                                }]
                        },
                        {
                            cols:[
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
                                },{
                                    view: 'text',
                                    name: 'w_value',
                                    placeholder: 'attribute value',
                                    gravity:2
                                }
                            ]
                        }
                    ]
                }
            },
            /**
             *
             * @param {TangoAttribute} attr
             * @memberof ui.DeviceViewPanel.DevicePanelAttributes
             */
            setAttribute:function(attr){
                this.attr = attr;
                var info = [];
                info.push({info:'Name', value: attr.name});
                attr_info_values.forEach(function(el){
                    info.push({info:MVC.String.classize(el), value: attr.info[el]})
                }.bind(this));
                var $$info = this.$$('info');
                $$info.clearAll();
                $$info.parse(info);

                this.elements['btnPlot'].enable();
                if(attr.isScalar()){
                    this.elements['btnPlotHist'].enable();
                }
                if (attr.info.writable.includes("WRITE"))
                    this.elements['btnWrite'].enable();
                else
                    this.elements['btnWrite'].disable();
            },
            /**
             * @constructs
             * @memberof ui.DeviceViewPanel.DevicePanelAttributes
             */
            $init: function (config) {
                webix.extend(config, this._ui());

                this.$ready.push(function () {
                    this.bind($$('device_info_panel').$$('attrs'));
                }.bind(this));
            },
            defaults: {
                on: {
                    /**
                     * Event listener
                     *
                     * @memberof ui.DeviceViewPanel.DevicePanelAttributes
                     */
                    onBindApply: function (obj, dummy, master) {
                        if (!obj) return this.clear();
                        this.setAttribute(obj);
                    }
                }
            }
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @augments webix.ui.form
     * @memberof ui.DeviceViewPanel
     * @name DevicePanelPipes
     * @type {protoUI}
     * @property {TangoPipe} pipe
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DevicePanelPipes = webix.protoUI(
        {
            pipe: null,
            name: 'device_panel_pipes',
            _read: function () {
                var pipe = this.pipe;

                UserAction.readPipe(pipe)
                    .then(function (resp) {
                        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_pipe_out.ejs'}).render(resp));
                    }.bind(this))
                    .fail(error_handler.bind(this));

            },
            _write: function () {
                var pipe = this.pipe;

                var input;
                try {
                    input = JSON.parse(this.elements.input.getValue())
                } catch (e) {
                    TangoWebappHelpers.error(e);
                }

                UserAction.writePipe(pipe, input)
                    .then(function (resp) {
                        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_pipe_out.ejs'}).render(resp));
                    }.bind(this))
                    .fail(error_handler.bind(this));
            },
            _ui: function () {
                return {
                    elements: [
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
            /**
             *
             * @param {TangoPipe} pipe
             * @memberof ui.DeviceViewPanel.DevicePanelPipes
             */
            setPipe:function(pipe){
                this.pipe = pipe;
            },
            /**
             * @constructs
             * @memberof ui.DeviceViewPanel.DevicePanelPipes
             */
            $init: function (config) {
                webix.extend(config, this._ui());
                this.$ready.push(function () {
                    this.bind($$('device_info_panel').$$('pipes'));
                }.bind(this));
            },
            defaults:{
                on:{
                    /**
                     *
                     * @param pipe
                     * @memberof ui.DeviceViewPanel.DevicePanelPipes
                     * @inner
                     */
                    onBindApply:function(pipe){
                        if(!pipe) return;
                        this.setPipe(pipe);

                    }
                }
            }
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);
    
    /**
     * See {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     *
     * @augments webix.ui.layout
     * @memberof ui.DeviceViewPanel
     * @name DeviceControlPanel
     * @type {protoUI}
     * @property {DevicePanelCommands} commands
     * @property {DevicePanelAttributes} attrs
     * @property {DevicePanelPipes} pipes
     * @see {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DeviceControlPanel = webix.protoUI(
        {
            name: 'device_control_panel',
            /**
             * @memberof ui.DeviceControlPanel
             * @inner
             */
            clearAll: function () {
                //TODO
                this.$$('commands').clearAll();
                this.$$('attrs').clearAll();
                this.$$('pipes').clearAll();
            },
            _ui: function (context) {
                return {
                    rows: [
                        {
                            view: "multiview",
                            gravity: 3,
                            cells: [
                                {
                                    view: 'device_panel_empty'
                                },
                                {
                                    view: 'device_panel_commands',
                                    id: 'commands',
                                    context: context
                                },
                                {
                                    view: 'device_panel_attributes',
                                    id: 'attrs',
                                    context: context
                                },
                                {
                                    view: 'device_panel_pipes',
                                    id: 'pipes',
                                    context: context
                                }
                            ]
                        },
                        {view: "resizer"},
                        {
                            view: 'textarea',
                            id: 'output',
                            gravity: 2
                        }
                    ]
                };
            },
            _update_header:function(data){
                $$("device_control_panel_header").config.header = webix.template(function () {
                    switch(data.kind){
                        case "commands":
                            return "<span class='webix_icon fa-keyboard-o'></span> Command: " + TangoCommand.find_one(data.id).display_name;
                        case "attrs":
                            return "<span class='webix_icon fa-keyboard-o'></span> Attr: " + TangoAttribute.find_one(data.id).display_name;
                        case "pipes":
                            return "<span class='webix_icon fa-keyboard-o'></span> Pipe: " + TangoPipe.find_one(data.id).display_name;
                    }

                });
                $$("device_control_panel_header").refresh();
            },
            /**
             * @constructs
             * @memberof ui.DeviceViewPanel.DeviceControlPanel
             */
            $init: function (config) {
                webix.extend(config, this._ui(config.context));

                this.$ready.push(function () {
                    // this.$$('device').bind(config.context.devices);
                }.bind(this));
            },
            defaults: {
                on: {
                    /**
                     * @listens event:item_selected
                     * @function
                     * @memberof ui.DeviceViewPanel.DeviceControlPanel.prototype
                     * @inner
                     */
                    "tango_webapp.item_selected subscribe":function(event){
                        this._update_header(event.data);
                        var $$view = this.$$(event.data.kind);
                        $$view.show(true);

                        switch (event.data.kind){
                            case "commands":
                                $$view.setCommand(TangoCommand.find_one(event.data.id));
                                break;
                            case "attrs":
                                $$view.setAttribute(TangoAttribute.find_one(event.data.id));
                                break;
                            case "pipes":
                                $$view.setPipe(TangoPipe.find_one(event.data.id));
                                break;
                        }
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    /**
     * Factory function for {@link DeviceInfoPanel}
     *
     * @param context
     * @return {DeviceInfoPanel}
     * @memberof ui.DeviceViewPanel
     */
    TangoWebapp.ui.newDeviceInfoPanel = function(context){
        return {
            header: kDevicePanelHeader,
            id: 'device_tree',
            body: {
                context: context,
                id: 'device_info_panel',
                view: 'device_info_panel'
            }
        }
    };

    /**
     * Factory function for {@link DeviceControlPanel}
     *
     * @param context
     * @function
     * @memberof ui.DeviceViewPanel
     */
    TangoWebapp.ui.newDeviceControlPanel = function (context) {
        return {
            header: kDeviceControlPanelHeader,
            width: 300,
            id: 'device_control_panel_header',
            collapsed: true,
            body: {
                context: context,
                view: 'device_control_panel',
                id: 'device_control_panel'
            }
        };
    }

})();

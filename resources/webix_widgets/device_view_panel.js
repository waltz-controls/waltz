/**
 * @module DeviceViewPanel
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
(function(){
    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var header = "<span class='webix_icon fa-microchip'></span> Device: ";

    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var device_info = [
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

            device_info.forEach(function(item){
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
            return header + device.display_name;
        });
        $$("device_tree").refresh();
    };

    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var filter = function () {
        return {
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
        }
    };

    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var context_menu = {
        view: "contextmenu",
        //autoheight: true,
        id: 'attrs-menu',
        data: [
            {id: 'add_to_monitor', value: 'Add to monitor'}
        ],
        on: {
            onItemClick: function (id) {
                var tree = this.config.master;
                var item = tree.getItem(this.getContext().id);
                var parent = tree.getItem(item.$parent);
                OpenAjax.hub.publish("tango_webapp.attr_" + id, {
                    data: parent.values.getItem(item.id)
                });
            }
        }
    };

    var device_tree_list = function(id){
        return {
            view: 'list',
            id: id,
            select: true,
            template: "#display_name#",
            on: {
                onBindApply: function (device) {
                    if (device.id === undefined) return false;
                    this.clearAll();
                    this.data.importData(device[id]);
                    this.sort("#display_name#","asc","string");
                },
                onAfterSelect:function(id){
                    OpenAjax.hub.publish("tango_webapp.item_selected", {
                        data: {
                            id: id,
                            kind: this.config.$id
                        }
                    });
                }
            }
        }
    };

    var device_view = webix.protoUI({
        name: 'device_tree_view',
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
                                        filter(),
                                        device_tree_list('commands')
                                    ]
                                }
                            },
                            {
                                header: "Attributes",
                                body: {
                                    rows:[
                                        filter(),
                                        device_tree_list('attrs')
                                    ]
                                }
                            },
                            {
                                header: "Pipes",
                                body: {
                                    rows:[
                                        filter(),
                                        device_tree_list('pipes')
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

            webix.ui(context_menu).attachTo(this);
        }
    }, webix.IdSpace, webix.ui.layout);

    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var attr_info_values = [
        'label','writable','data_format','data_type','max_dim_x','max_dim_y','unit','standard_unit',
        'display_unit','format','min_value','max_value'];

    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     * @namespace attr_info_datatable
     */
    var attr_info_datatable = {
        id: 'info',
        view: 'datatable',
        header:false,
        columns:[
            {id:'info' },
            {id:'value', fillspace: true}
        ],
        on:{
            /** Event listener
             * @function
             * @param attr
             * @memberof ui.DeviceViewPanel.attr_info_datatable
             */
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
    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     * @namespace commands_info_datatable
     */
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
            /** Event listener
             * @function
             * @param {TangoCommand} cmd
             * @returns {boolean}
             * @memberof  ui.DeviceViewPanel.commands_info_datatable
             */
            onBindApply:function(cmd){
                if(!cmd) return false;
                this.setValues(cmd.info);
            }
        }
    };
    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     * @namespace synchronizer
     */
    var synchronizer = {
        _what: null,
        _command: null,
        synchronize: function (device) {
            TangoWebappHelpers.debug("device[" + device.id + "]." + this._what + ".count=" + device[this._what].count());
            this.$$('list').unselect();
            if (device[this._what].count() === 0) {
                this.showProgress({
                    type: "icon"
                });
                device[this._command]().then(function (items) {
                    importData(this.$$('list'), device[this._what]);
                    this.hideProgress();
                }.bind(this))
            } else {
                importData(this.$$('list'), device[this._what]);
                this.elements.name.setValue('');//drop currently selected item
            }
        },
        /**
         * @constructor
         * @memberof ui.DeviceViewPanel.synchronizer
         */
        $init: function (config) {
            this._what = config.id;
            this._command = 'fetch' + MVC.String.classize(this._what);
        }
    };

    /**
     * @function
     * @memberof ui.DeviceViewPanel
     * @return {Function}
     */
    var importData = function($$list, data) {
        $$list.data.importData(data);
        $$list.sort("#display_name#","asc","string");
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @memberof ui.DeviceViewPanel
     * @namespace test_device_commands
     * @property {String} name
     */
    var test_device_commands = webix.protoUI(
        {
            name: 'device_panel_commands',
            _execute_command: function () {
                var command = this.$$('list').getSelectedItem();
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
                        {
                            view: 'text',
                            type: 'hidden',
                            height: 2,
                            name: 'name',
                            validate: webix.rules.isNotEmpty,
                            invalidMessage: 'Command must be selected from the list'
                        },
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
             * @constructor
             * @memberof ui.DeviceViewPanel.test_device_commands
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
                    /* Event listener
                    */
                    onBindApply: function (command) {
                        if (!command) return;

                        this.clearValidation();

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
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    /**
     * @function
     * @param view
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
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
    /**
     * @function
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
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
    /**
     * @function
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
    var openImageWindow = function (resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: "<span class='webix_icon fa-image'></span>[<span class='webix_strong'>" + device.display_name + '/' + this.display_name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newImageView(webix.extend({id: this.id}, resp))
        }, resp);
    };
    /**
     * @function
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
    var openScalarWindow = function(resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: "<span class='webix_icon fa-at'></span>[<span class='webix_strong'>" + device.display_name + '/' + this.display_name + "</span>]",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newScalarView(webix.extend({id: this.id}, resp))
        }, resp)
    };
    /**
     * @function
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
    var attr_output_handler = function (resp) {
        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_attribute_out.ejs'}).render(resp));
    };
    /**
     * @function
     * @param resp
     * @memberof ui.DeviceViewPanel
     */
    var error_handler = function (resp) {
        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_error_out.ejs'}).render(resp));
        //clear errors
        resp.errors.length = 0;
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @memberof ui.DeviceViewPanel
     * @namespace test_device_attributes
     * @property {String} name
     */
    var test_device_attributes = webix.protoUI(
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
             * @constructor
             * @memberof ui.DeviceViewPanel.test_device_attributes
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
                     * @memberof ui.DeviceViewPanel.test_device_attributes
                     */
                    onBindApply: function (obj, dummy, master) {
                        if (!obj) return this.clear();
                        this.attr = obj;
                        var info = [];
                        info.push({info:'Name', value: obj.name});
                        attr_info_values.forEach(function(el){
                            info.push({info:MVC.String.classize(el), value: obj.info[el]})
                        }.bind(this));
                        var $$info = this.$$('info');
                        $$info.clearAll();
                        $$info.parse(info);

                        this.elements['btnPlot'].enable();
                        if(obj.isScalar()){
                            this.elements['btnPlotHist'].enable();
                        }
                        if (obj.info.writable.includes("WRITE"))
                            this.elements['btnWrite'].enable();
                        else
                            this.elements['btnWrite'].disable();
                    }
                }
            }
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
     * @memberof ui.DeviceViewPanel
     * @namespace test_device_pipes
     * @property {String} name
     */
    var test_device_pipes = webix.protoUI(
        {
            name: 'device_panel_pipes',
            _read: function () {
                var pipe = this.$$('list').getSelectedItem();

                UserAction.readPipe(pipe)
                    .then(function (resp) {
                        this.getTopParentView().$$('output').setValue(new View({url: 'views/dev_panel_pipe_out.ejs'}).render(resp));
                    }.bind(this))
                    .fail(error_handler.bind(this));

            },
            _write: function () {
                var pipe = this.$$('list').getSelectedItem();

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
             * @constructor
             * @memberof ui.DeviceViewPanel.test_device_pipes
             */
            $init: function (config) {
                webix.extend(config, this._ui());
                this.$ready.push(function () {
                    // this.bind(this.$$('list'))
                }.bind(this));
            }
        }, webix.ProgressBar, webix.IdSpace, webix.ui.form);
    /**
     * @constant
     * @memberof ui.DeviceViewPanel
     */
    var device_panel_header = {
        type: 'clean',
        id: 'device',
        height: 30,
        //TODO align center
        complexData: true,
        template: '[<span class="webix_strong">#display_name#@#host.id#</span>] exported = #info.exported#',
        on: {
            /* Event listener
            */
            onBindApply: function () {
                var top = this.getTopParentView();
                var device = this.data;
                if (!device.id || device.id == 'unknown' || !device.info.exported) {
                    top.disable();
                    return;
                }

                top.$$('commands').synchronize(device);
                //TODO rename MVC.Class.attributes to anything
                top.$$('attrs').synchronize(device);
                top.$$('attrs').$$('info').clearAll();
                top.$$('pipes').synchronize(device);
                top.enable();
            }
        }
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.DeviceViewPanel
     * @namespace device_control_panel
     */
    var device_control_panel = webix.protoUI(
        {
            name: 'device_control_panel',
            /**
             * @memberof ui.DeviceControlPanel.device_control_panel
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
                    return header + device.display_name;
                });
                $$("device_control_panel_header").refresh();
            },
            /**
             * @constructor
             * @memberof ui.DeviceViewPanel.device_control_panel
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
                     * Event listener
                     * @memberof ui.DeviceViewPanel.device_control_panel
                     */
                    "tango_webapp.item_selected subscribe":function(event){
                        var self = event.controller;
                        self.$$(event.data.kind)._update_header(event.data);
                        self.$$(event.data.kind).show(true);
                    },
                    "platform_api.ui.initialized subscribe": function (event) {
                        TangoWebappHelpers.debug('test_device_panel.platform_context.create subscribe');
                        // event.controller.$$('device').bind(event.data.context.devices);
                    },
                    "platform_context.destroy subscribe": function (event) {
                        TangoWebappHelpers.debug('test_device_panel.platform_context.destroy subscribe');
                        // event.controller.$$('device').unbind();
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

    /**
     *
     * @param context
     * @return {{header: *|string, id: string, body: {context: *, view: string}}}
     */
    TangoWebapp.ui.newDeviceInfoPanel = function(context){
        return {
            header: header,
            id: 'device_tree',
            body: {
                context: context,
                id: 'device_info_panel',
                view: 'device_tree_view'
            }
        }
    };

    /**
     * @param context
     * @memberof ui.DeviceViewPanel
     */
    TangoWebapp.ui.newDeviceControlPanel = function (context) {
        return {
            header: "<span class='webix_icon fa-keyboard-o'></span> Device Control Panel",
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

const kCommands_info_datatable = {
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
const command_info_panel = webix.protoUI(
    {
        command: null,
        name: 'command_info_panel',
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
                    kCommands_info_datatable,
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
                this.bind($$('device_view_panel').$$('commands'));
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
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
const pipe_info_panel = webix.protoUI(
    {
        pipe: null,
        name: 'pipe_info_panel',
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
                this.bind($$('device_view_panel').$$('pipes'));
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
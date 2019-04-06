import {newInfoDatatable, newInfoDatatableToolbar, parsePollable} from "./attr_info_panel.js";

function parseInfo(command){
    return Object.entries(command.info).map(entity => ({info:MVC.String.classize(entity[0]),value:entity[1]}));
}

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
        refresh(){
            this.setCommand(this.command);
        },
        save() {
            const $$info = this.$$('info');
            const polled = $$info.getItem('polled').value || $$info.getItem('polled').value === "true" || $$info.getItem('polled').value === "1";
            const poll_rate = $$info.getItem('poll_rate').value;
            UserAction.updatePolling(this.command, polled, poll_rate)
                .fail(TangoWebappHelpers.error);
        },
        _ui: function () {
            return {
                rows: [
                    newInfoDatatable(),
                    newInfoDatatableToolbar()
                ]
            }
        },
        /**
         *
         * @param {TangoCommand} command
         * @memberof ui.DeviceViewPanel.DevicePanelCommands
         */
        async setCommand(command){
            this.command = command;

            const info = parseInfo(command);

            info.push(await parsePollable(command));

            this.$$('info').clearAll();
            this.$$('info').parse(info);
        },
        /**
         * @constructs DevicePanelCommands
         * @memberof ui.DeviceViewPanel.DevicePanelCommands
         */
        $init: function (config) {
            webix.extend(config, this._ui());
            // this.$ready.push(function () {
            //     this.bind($$('device_view_panel').$$('commands'));
            // }.bind(this));
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
    }, webix.ProgressBar, webix.IdSpace, webix.ui.layout);
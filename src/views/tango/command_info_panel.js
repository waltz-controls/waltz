import {newInfoDatatable, newInfoDatatableToolbar, parsePollable, savePolling} from "./info_control_panel";
import {StringUtils} from "utils";
import {WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";

function parseInfo(command){
    return Object.entries(command.info).map(entity => ({info:StringUtils.classize(entity[0]),value:entity[1]}));
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
        get $$info(){
            return this.$$('info');
        },
        //TODO
        get attr(){
            return this.command;
        },
        async refresh(){
            this.showProgress();
            const rest = await this.getTangoRest();
            rest.newTangoCommand(this.command.tango_id).toTangoRestApiRequest().get().toPromise()
                .then(command => this.setCommand(new TangoCommand(command)))
                .then(() => this.hideProgress());
        },
        async save() {
            this.showProgress();
            const rest = await this.getTangoRest();
            savePolling(this.$$info, rest, this.command.tango_id)
                .then(() => this.hideProgress());
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
            const rest = await this.getTangoRest();

            info.push(...(await parsePollable(command, rest)));

            this.$$info.clearAll();
            this.$$info.parse(info);
        },
        /**
         * @constructs DevicePanelCommands
         * @memberof ui.DeviceViewPanel.DevicePanelCommands
         */
        $init: function (config) {
            webix.extend(config, this._ui());
        },
        defaults: {
            complexData: true
        }
    }, WaltzWidgetMixin, webix.ProgressBar, webix.IdSpace, webix.ui.layout);
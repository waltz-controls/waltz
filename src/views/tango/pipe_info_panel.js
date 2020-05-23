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
import {newInfoDatatable, newInfoDatatableToolbar} from "./info_control_panel";
import {StringUtils, WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";
import {TangoPipe} from "@waltz-controls/waltz-tango-rest-plugin";

function parseInfo(pipe){
    return Object.entries(pipe.info).map(entity => ({info:StringUtils.classize(entity[0]),value:entity[1]}));
}

const pipe_info_panel = webix.protoUI(
    {
        pipe: null,
        name: 'pipe_info_panel',
        get $$info(){
            return this.$$('info');
        },
        async refresh(){
            this.showProgress();
            const rest = await this.getTangoRest();
            rest.newTangoPipe(this.pipe.tango_id).toTangoRestApiRequest().get().toPromise()
                .then(pipe => this.setPipe(new TangoPipe(pipe)))
                .then(() => this.hideProgress());
        },
        save(){
            return false;
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
         * @param {TangoPipe} pipe
         * @memberof ui.DeviceViewPanel.DevicePanelPipes
         */
        setPipe:function(pipe){
            this.pipe = pipe;

            const info = parseInfo(pipe);

            this.$$info.clearAll();
            this.$$info.parse(info);
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DevicePanelPipes
         */
        $init: function (config) {
            webix.extend(config, this._ui());
            // this.$ready.push(function () {
            //     this.bind($$('device_view_panel').$$('pipes'));
            // }.bind(this));
        }
    }, WaltzWidgetMixin, webix.ProgressBar, webix.IdSpace, webix.ui.layout);
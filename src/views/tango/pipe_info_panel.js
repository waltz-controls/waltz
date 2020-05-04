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
import {newInfoDatatable, newInfoDatatableToolbar} from "./attr_info_panel.js";

const pipe_info_panel = webix.protoUI(
    {
        pipe: null,
        name: 'pipe_info_panel',
        refresh(){
            this.setPipe(this.pipe);
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

            const info = [
                {info: "Name", value: pipe.name}
            ];

            const $$info = this.$$('info');
            $$info.clearAll();
            $$info.parse(info);
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
    }, webix.ProgressBar, webix.IdSpace, webix.ui.layout);
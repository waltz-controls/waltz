import "./device_info_panel";
import "./attr_info_panel";
import "./command_info_panel";
import {kTangoTypeAttribute, kTangoTypeCommand, kTangoTypeDevice, kTangoTypePipe, Pollable} from "models/tango";
import {pollStatus, updatePolling} from "controllers/tango_rest";
import {defaultIfEmpty, filter, map} from "rxjs/operators";

export function newInfoDatatable(){
    return {
        id: 'info',
        view: 'treetable',
        header:false,
        editable:true,
        columns:[
            {id:'info' , template:"{common.icon()} #info#"},
            {id:'value', editor: "text", template:(obj, common, value) => {
                    if(obj.id === 'polled') {
                        return common.checkbox(obj, common, obj.value, {
                            checkValue: true
                        });
                    }
                    else return value;
                }, fillspace: true}
        ],
        rules: {
            poll_rate: webix.rules.isNumber
        },
        on:{
            onBeforeEditStart:function(id){
                const row = id.row;
                return row !== 'polled';
            }
        }
    };
}

export function newInfoDatatableToolbar() {
    return {
        view:"toolbar",
        maxHeight: 30,
        cols:[
            {
                view:"icon",
                icon:"wxi-sync",
                click(){
                    this.getTopParentView().refresh();
                }
            },
            {},
            {
                view:"icon",
                icon:"wxi-check",
                click(){
                    this.getTopParentView().save();
                }
            }
        ]
    };
}

    export async function parsePollable(tango, rest) {
        const device = rest.newTangoDevice(tango.tango_id)
        const pollables = pollStatus(device);

        return pollables.pipe(
            filter(pollable => pollable.name === tango.name),
            defaultIfEmpty(new Pollable({...tango})),
            map(pollable => [
                {id:'polled', info: "IsPolled", value: pollable.polled, pollable},
                {id:'poll_rate', info: "Period (ms)", value: pollable.poll_rate}
            ])
        ).toPromise();
    }

    export async function savePolling($$info, rest, tango_id){
        const polled = $$info.getItem('polled').value || $$info.getItem('polled').value === "true" || $$info.getItem('polled').value === "1";
        const pollable = $$info.getItem('polled').pollable;
        const poll_rate = $$info.getItem('poll_rate').value;
        const device = rest.newTangoDevice(tango_id);
        return updatePolling(device, pollable, polled, poll_rate).toPromise();
    }

/**
 * More info: {@link https://docs.webix.com/api__refs__ui.view.html webix.ui.view}
 * @augments webix.ui.view
 * @memberof ui.DeviceViewPanel
 * @name info_panel_empty
 * @type {protoUI}
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const info_panel_empty = webix.protoUI({
    name:"info_panel_empty",
    $init:function(){
    }
},  webix.ProgressBar, webix.ui.view);

/**
 * See {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 *
 * @augments webix.ui.layout
 * @memberof ui.DeviceViewPanel
 * @name info_control_panel
 * @type {protoUI}
 * @property {DevicePanelCommands} commands
 * @property {DevicePanelAttributes} attrs
 * @property {DevicePanelPipes} pipes
 * @see {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const info_control_panel = webix.protoUI(
    {
        name: 'info_control_panel',
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
        get $$device(){
            return this.$$('device');
        },
        get $$attribute(){
            return this.$$('attrs');
        },
        get $$command(){
            return this.$$('commands');
        },
        _ui: function (config) {
            return {
                rows: [
                    {
                        view: "multiview",
                        gravity: 3,
                        cells: [
                            {
                                view: 'info_panel_empty'
                            },
                            {
                                root: config.root,
                                view: 'device_info_panel',
                                id: 'device'
                            },
                            {
                                root: config.root,
                                view: 'command_info_panel',
                                id: 'commands'
                            },
                            {
                                root: config.root,
                                view: 'attr_info_panel',
                                id: 'attrs'
                            },
                            {
                                root: config.root,
                                template: 'pipe_info_panel',
                                id: 'pipes'
                            }
                        ]
                    }
                ]
            };
        },
        updateHeader:function(tango){
            $$("info_control_panel_header").config.headerAlt = webix.template(() => {
                switch(tango.type){
                    case kTangoTypeDevice:
                        return `<span class='webix_icon mdi mdi-information-variant'></span> ${tango.alias || tango.name}`;
                    case kTangoTypeCommand:
                    case kTangoTypeAttribute:
                    case kTangoTypePipe:
                        return `<span class='webix_icon mdi mdi-information-variant'></span> ${tango.device}/${tango.name}`;
                    default:
                        throw new Error(`Unknown selected tango entity =${tango.type}`);
                }

            });
            $$("info_control_panel_header").refresh();
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DeviceControlPanel
         */
        $init: function (config) {
            webix.extend(config, this._ui(config));
        }
    }, webix.IdSpace, webix.ui.layout);
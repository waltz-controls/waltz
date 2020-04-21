import {UpdateDeviceAlias} from "../../src/models/tango_webapp/user_action.js";

const kDevice_info_values = [
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



/**
 * @namespace InfoDatatable
 * @memberof ui.Utils
 */
function newDeviceInfoDatatable (){
    return {
        id: 'info',
        view: 'datatable',
        header: false,
        autoheight: true,
        editable: true,
        columns: [
            {id: 'info'},
            {id: 'value', editor: "text", fillspace: true}
        ],
        on: {
            onBeforeEditStart: function (id) {
                var row = id.row;
                return row === 'alias';
            }
        }
    }
}

export function get_device_info(device) {
    const result = [];

    kDevice_info_values.forEach(function(item){
        result.push({
            info: MVC.String.classize(item),
            value: device.info[item]
        })
    });

    return result;
}

/**
 *
 * @param {string} id
 * @return {{view: string, columns: *[], header: boolean, autoheight: boolean, id: *}}
 */
function newPolledDatatable(id) {
    return {
        view: "datatable",
        id: id,
        header: false,
        autoheight: true,
        columns: [
            {id: 'name'},
            {id: 'poll_rate', template: "#poll_rate# (ms)", fillspace: true}
        ]
    }
}


const toolbar = {
    view: "toolbar",
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
            view: "icon",
            value: "Add",
            icon: "wxi-eye",
            tooltip: "Monitor",
            click(){
                OpenAjax.hub.publish("tango_webapp.device_view", {
                    data: {
                        device: this.getTopParentView().device
                    }
                });
            }
        },
        {
            view: "icon",
            value: "Add",
            icon: "mdi mdi-settings",
            tooltip: "Configure",
            click(){
                OpenAjax.hub.publish("tango_webapp.device_configure", {
                    data: {
                        device: this.getTopParentView().device
                    }
                });
            }
        },
        {
            view: "icon",
            icon: "wxi-check",
            tooltip: "Save alias",
            click(){
                this.getTopParentView().save();
            }
        }
    ]
};


function newPropertiesDatatable() {
    return {
        view: "datatable",
        id: "properties",
        header: false,
        autoheight: true,
        columns: [
            {id: 'name'},
            {id: 'values', fillspace: true}
        ]
    }
}

function updateHeader(device) {
    $$("info_control_panel_header").config.header = webix.template(() =>  `<span class='webix_icon ${device.getIcon()}'></span> Device: ${device.display_name}`);

    $$("info_control_panel_header").refresh();
}


const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    get device(){
        return this.$$('info').device;
    },
    async refresh(){
        let device, other;
        [device,...other] = await webix.promise.all(
            [this.device.fetchInfo(),
             this.device.fetchProperties(),
             this.device.pollStatus()]).fail(TangoWebappHelpers.error);

        this.setDevice(device);
    },
    updateAlias(alias){
        const device = this.device;
        return new UpdateDeviceAlias({user: PlatformContext.UserContext.user, device: device, alias, remove: !alias || alias === device.name}).submit();
    },
    save(){
        const $$info = this.$$('info');
        $$info.editStop();

        const alias = $$info.getItem("alias");
        this.updateAlias(alias.value).then(() => {
            this.refresh();
        });
    },
    _syncPollables(type, source) {
        this.getTopParentView().$$(`polled_${type}`).data.sync(source, function () {
            this.filter((pollable) => {
                return pollable.polled;
            });
        });
    },
    setDevice(device){
        if (!device || device.id === undefined) return false;

        //TODO fire event, or even better use bind for all types in info_control_panel
        updateHeader(device);

        const info = get_device_info(device);
        info.push({
            id:'alias',
            info: 'Alias',
            value: device.alias
        });

        this.$$('info').clearAll();
        this.$$('info').parse(info);

        this.$$('info').device = device;
        this.$$('properties').data.sync(device.properties);

        this._syncPollables.call(this.$$('info'), 'attributes',device.attrs);

        this._syncPollables.call(this.$$('info'), 'commands',device.commands);
    },
    _ui(){
        return {
            fitBiggest:true,
            rows:[
                newDeviceInfoDatatable(),
                {
                    template: "Properties",
                    type: "header"
                },
                newPropertiesDatatable(),
                {
                    template: "Polled attributes",
                    type: "header"
                },
                newPolledDatatable("polled_attributes"),
                {
                    template: "Polled commands",
                    type: "header"
                },
                newPolledDatatable("polled_commands"),
                {
                    minHeight:1
                },
                toolbar
            ]
        }
    },
    $init:function(config){
        webix.extend(config, this._ui());
    },
    defaults:{
        on:{
            "tango_webapp.item_selected subscribe"(event){
                if("device" === event.data.kind){
                    const device = TangoDevice.find_one(event.data.id);
                    this.setDevice(device);
                }
            }
        }
    }
},  TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

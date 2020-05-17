import {UpdateDeviceAlias} from "models/user_action.js";
import {StringUtils} from "utils";
import {kControllerUserAction} from "controllers/user_action_controller";
import {kUserContext} from "controllers/user_context";
import {filter, map, toArray} from "rxjs/operators";
import {
    kTangoRestContext,
    kTangoTypeAttribute,
    kTangoTypeCommand,
    Pollable,
    pollStatus,
    TangoDevice,
    updatePolling
} from "@waltz-controls/waltz-tango-rest-plugin";
import {forkJoin} from "rxjs";

const kDevice_info_values = [
    "name",
    "classname",
    "server",
    "pid",
    "hostname",
    "version",
    "exported",
    "last_exported",
    "last_unexported"
];



/**
 * @namespace InfoDatatable
 * @memberof ui.Utils
 */
function newDeviceInfoDatatable (){
    return {
        id: 'info',
        view: 'treetable',
        header: false,
        editable: true,
        columns: [
            {id: 'info' , editor: "text", template:"{common.icon()} {common.delete()} #info#"},
            {id: 'value', editor: "text", fillspace: true, template(obj){
                    if(obj.polled) return `${obj.value} (ms)`
                    else return obj.value;
                }}
        ],
        type:{
            delete(obj){
                if(obj.isProperty) return `<span class="removeProperty webix_list_icon mdi mdi-close"></span>`;
                else return "";
            }
        },
        on: {
            onAfterEditStop(data, obj) {
                if(obj.isProperty && obj.column === "info")
                    this.data.changeId(obj.row, this.getTopParentView().device.id + "/" + data.value);
                if (obj.isProperty && obj.column === "value")
                    this.data.updateItem(obj.row, {value: (data.value.split) ? data.value.split(',') : data.value})
            },
            onBeforeEditStart: function (id) {
                const row = id.row;
                const item = this.getItem(row);
                return (row === 'alias') || item.isProperty === true || item.polled === true;
            }
        },
        onClick: {
            removeProperty(ev, id){
                this.getTopParentView().deleteProperty(this.data.getItem(id.row))
                    .then(() => this.data.remove(id.row));

                return false;
            }
        },
        rules: {
            info: webix.rules.isNotEmpty,
            // value: webix.rules.isNotEmpty,
            poll_rate: webix.rules.isNumber
        }
    }
}

/**
 *
 * @param device
 * @return {{value: *, info: *}[]}
 */
function loadInfo(device){
    return kDevice_info_values.map(item => ({
            info: StringUtils.classize(item),
            value: device.info[item]
        })
    );
}

function loadProperties(device){
    return device.properties().get().pipe(
        map(resp => resp.map(property => ({id: `${device.id.getTangoDeviceId()}/${property.name}`, info: property.name, value:property.values, isProperty: true}))),
        map(properties => ({id: kPropertiesRowId, info:'Properties', value: properties.length, data: properties}))
    ).toPromise();
}

function loadPollables(device){
    const pollables = pollStatus(device);

    return forkJoin([
        pollables.pipe(
            filter(pollable => pollable.type === kTangoTypeAttribute),
            map(pollable => ({...pollable, info: pollable.name, value: pollable.poll_rate})),
            toArray()
        ),
        pollables.pipe(
            filter(pollable => pollable.type === kTangoTypeCommand),
            map(pollable => ({...pollable, info: pollable.name, value: pollable.poll_rate})),
            toArray()
        )
    ]).pipe(
        map(([attributes, commands]) => [
            {id:'polled_attributes', info: 'Polled Attributes:', value:attributes.length, data: attributes},
            {id:'polled_commands', info:'Polled Commands:', value:commands.length, data:commands}
        ])
    ).toPromise()
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
            icon: "wxi-plus",
            tooltip: "Add property",
            click(){
                this.getTopParentView().addProperty();
            }
        },
        {
            view: "icon",
            icon: "wxi-check",
            tooltip: "Apply...",
            click(){
                this.getTopParentView().save();
            }
        }
    ]
};


/**
 *
 * @return {Promise<tango.TangoDevice>}
 */
async function getRestTangoDevice(){
    const rest = await this.config.root.app.getContext(kTangoRestContext);
    return rest.newTangoDevice(this.device.tango_id);
}

const kPropertiesRowId = 'properties';
const kAllFound = false;
const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    device: null,
    get $$info(){
        return this.$$('info');
    },
    get $$properties(){
        return this.$$(kPropertiesRowId);
    },
    get $$attributes(){
        return this.$$('polled_attributes');
    },
    get $$commands(){
        return this.$$('polled_commands');
    },
    async refresh(){
        this.showProgress();
        const device = await getRestTangoDevice.call(this);
        device.toTangoRestApiRequest().get().toPromise()
            .then(device => this.setDevice(new TangoDevice(device)))
            .then(() => this.hideProgress());
    },
    addProperty(){
        this.$$info.editStop();
        const id = this.$$info.add({
            info: "New property",
            value: "",
            isProperty: true
        },0, kPropertiesRowId);
        this.$$info.editRow(id);
    },
    deleteProperty(property){
        return getRestTangoDevice.call(this)
            .then(device => device.toTangoRestApiRequest()
                                    .properties()
                                    .delete(`/${property.info}`)
                                    .toPromise()
                );
    },
    async updateAlias(alias){
        if(alias === this.device.alias) return;
        const device = this.device;
        const user = (await this.config.root.app.getContext(kUserContext)).user;
        return this.config.root.app.getController(kControllerUserAction)
            .submit(new UpdateDeviceAlias({user, device, alias, remove: !alias || alias === device.name}))
    },
    async saveProperties(){
        const properties = {};
        this.$$info.editStop();
        this.$$info
            .find(item => item.isProperty, kAllFound)
            .forEach(row => {
                properties[row.info] = (row.value.split) ? row.value.split(',') : row.value;
            });


        (await getRestTangoDevice.call(this)).toTangoRestApiRequest()
            .properties()
            .put(`?${Object.entries(properties)
                .map(([key, values]) => values.map(value => ({key, value})))
                .flat()
                .map(property => property.key + "=" + property.value)
                .join('&')
            }`)
            .toPromise();
    },
    savePolling(){
        return this.$$info.find(item => item.polled === true, kAllFound)
            .map(async pollable => {
                const device = await getRestTangoDevice.call(this);
                return updatePolling(device, new Pollable({...pollable}), true, pollable.value).toPromise()
            })
    },
    save(){
        this.$$info.editStop();
        this.$$info.clearValidation();

        this.showProgress();

        const alias = this.$$info.getItem("alias");
        Promise.all(
            [this.updateAlias(alias.value),
                this.saveProperties(),
                ...this.savePolling(),
            ]
        ).then(() => this.hideProgress());

    },

    /**
     *
     * @param {TangoDevice} device
     * @return {Promise<boolean>}
     */
    async setDevice(device){
        if (!device || device.id === undefined) return false;
        this.device = device;
        this.$$info.clearAll();

        const info = [{
            id:'alias',
            info: 'Alias',
            value: device.alias
        }];
        info.push(...loadInfo(device));

        const _device = await getRestTangoDevice.call(this);

        const properties = await loadProperties(_device);

        info.push(properties);

        const pollables = await loadPollables(_device);

        info.push(...pollables);


        this.$$info.parse(info);
    },
    _ui(config){
        return {
            rows:[
                newDeviceInfoDatatable(),
                {
                    ...toolbar
                }
            ]
        }
    },
    $init:function(config){
        webix.extend(config, this._ui(config));
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout);

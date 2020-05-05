import {UpdateDeviceAlias} from "models/user_action.js";
import {StringUtils} from "utils";
import {kTangoRestContext, pollStatus} from "controllers/tango_rest";
import {kControllerUserAction} from "controllers/user_action_controller";
import {kUserContext} from "controllers/user_context";
import {filter, toArray} from "rxjs/operators";
import {kTangoTypeAttribute, kTangoTypeCommand, TangoDevice} from "models/tango";

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

function loadInfo($$info, device){
    const info = [{
        id:'alias',
        info: 'Alias',
        value: device.alias
    }]
    info.push(...get_device_info(device));

    $$info.clearAll();
    $$info.parse(info);
}

function loadProperties($$properties, device){
    device.properties().get().subscribe(properties => {
        $$properties.clearAll();
        $$properties.parse(properties);
    });
}

function loadPollables($$attributes,$$commands, device){
    const pollables = pollStatus(device);

    pollables.pipe(
        filter(pollable => pollable.type === kTangoTypeAttribute),
        toArray()
    ).subscribe(polledAttributes => {
        $$attributes.clearAll();
        $$attributes.parse(polledAttributes);
    })

    pollables.pipe(
        filter(pollable => pollable.type === kTangoTypeCommand),
        toArray()
    ).subscribe(polledCommands => {
        $$commands.clearAll();
        $$commands.parse(polledCommands);
    })
}

function get_device_info(device) {
    return kDevice_info_values.map(item => ({
            info: StringUtils.classize(item),
            value: device.info[item]
        })
    );
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


function newPropertiesDatatable() {
    return {
        view: "datatable",
        id: "properties",
        editable: true,
        header: false,
        autoheight: true,
        columns: [
            {id:'remove', width: 24, template: () => '<span class="remove webix_list_icon mdi mdi-close"></span>'},
            {id: 'name', editor: "text"},
            {id: 'values', editor: "text", fillspace: true}
        ],
        rules: {
            name: webix.rules.isNotEmpty,
            values: webix.rules.isNotEmpty
        },
        on: {
            onAfterEditStop(data, obj) {
                if (obj.column === "name")
                    this.data.changeId(obj.row, this.getTopParentView().device.id + "/" + data.value);
                if (obj.column === "values")
                    this.data.updateItem(obj.row, {values: (data.value.split) ? data.value.split(',') : data.value})
            }
        },
        onClick:{
            "remove"(event, id){
                this.getTopParentView().deleteProperty(this.data.getItem(id.row))
                    .then(() => this.data.remove(id.row));

                return false;
                },
        }
    }
}

/**
 *
 * @return {Promise<tango.TangoDevice>}
 */
async function getRestTangoDevice(){
    const rest = await this.config.root.app.getContext(kTangoRestContext);
    return rest.newTangoDevice(this.device.tango_id);
}

const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    device: null,
    get $$info(){
        return this.$$('info');
    },
    get $$properties(){
        return this.$$('properties');
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
        this.$$properties.editStop();
        const id = this.$$properties.add({
            name: "New property",
            values: ""
        });
        this.$$properties.editRow(id);
    },
    deleteProperty(property){
        return getRestTangoDevice.call(this)
            .then(device => device.toTangoRestApiRequest()
                                    .properties()
                                    .delete(`/${property.name}`)
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
        this.$$properties.editStop();
        this.$$properties.eachRow((rowId) => {
            const row = this.$$properties.getItem(rowId);
            if(row)
                properties[row.name] = (row.values.split) ? row.values.split(',') : row.values;
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
    save(){
        this.$$info.editStop();
        this.$$info.clearValidation();

        this.showProgress();

        const alias = this.$$info.getItem("alias");
        Promise.all(
            [this.updateAlias(alias.value),
            this.saveProperties()]
        ).then(() => this.hideProgress());

    },
    _syncPollables(type, source) {
        this.getTopParentView().$$(`polled_${type}`).data.sync(source, function () {
            this.filter((pollable) => {
                return pollable.polled;
            });
        });
    },

    /**
     *
     * @param {TangoDevice} device
     * @return {Promise<boolean>}
     */
    async setDevice(device){
        if (!device || device.id === undefined) return false;
        this.device = device;

        loadInfo(this.$$info,device)

        const _device = await getRestTangoDevice.call(this);

        loadProperties(this.$$properties, _device);

        loadPollables(this.$$attributes, this.$$commands, _device);
    },
    _ui(config){
        return {
            fitBiggest:true,
            rows:[
                newDeviceInfoDatatable(),
                {
                    height: 24,
                    template: "Properties",
                    type: "header"
                },
                newPropertiesDatatable(),
                {
                    height: 24,
                    template: "Polled attributes",
                    type: "header"
                },
                newPolledDatatable("polled_attributes"),
                {
                    height: 24,
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
        webix.extend(config, this._ui(config));
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout);

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
            {id: 'info', editor: "text" },
            {id: 'value', editor: "text", fillspace: true}
        ],
        _syncPollables(type, source) {
            this.getTopParentView().$$(`polled_${type}`).data.sync(source, function () {
                this.filter((pollable) => {
                    return pollable.polled;
                });
            });
        },
        on: {
            onBindApply: function (device) {
                if (!device || device.id === undefined) return false;

                var info = get_device_info(device);
                info.push({
                    id:'alias',
                    info: 'Alias',
                    value: device.alias
                });

                this.clearAll();
                this.parse(info);

                this.device = device;
                this.getTopParentView().$$('properties').data.sync(device.properties);

                this._syncPollables('attributes',device.attrs);

                this._syncPollables('commands',device.commands);
            },
            onBeforeEditStart: function (id) {
                var row = id.row;
                return row === 'alias';
            }
        }
    }
}

function get_device_info(device){
    const result = [];

    kDevice_info_values.forEach(function(item){
        result.push({
            info: MVC.String.classize(item),
            value: device.info[item]
        })
    });

    return result;
}

async function device_info_parser (device){


    //TODO Logging
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
            view:"button",
            type:"icon",
            icon:"refresh",
            maxWidth:30,
            click(){
                this.getTopParentView().refresh();
            }
        },
        {},
        {
            view: "button",
            value: "Add",
            type: "icon",
            icon: "eye",
            maxWidth: 30,
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
            view: "button",
            value: "Add",
            type: "icon",
            icon: "gears",
            maxWidth: 30,
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
            view: "button",
            type: "icon",
            maxWidth:30,
            icon: "save",
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

const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    get device(){
        return this.$$('info').device;
    },
    async refresh(){
        [device,...other] = await webix.promise.all(
            [this.device.fetchInfo(),
             this.device.fetchProperties(),
             this.device.pollStatus()]).fail(TangoWebappHelpers.error);

        device_info_parser.bind(this.$$('info'))(device);
    },
    updateAlias(alias){
        const device = this.device;
        if(!alias || alias === device.name)
            return UserAction.deleteDeviceAlias(device).fail(TangoWebappHelpers.error);
        else
            return UserAction.updateDeviceAlias(device, alias).fail(TangoWebappHelpers.error);
    },
    save(){
        const $$info = this.$$('info');
        $$info.editStop();

        const alias = $$info.getItem("alias");
        this.updateAlias(alias.value).then(() => {
            this.refresh();
        });
    },
    _ui(){
        return {
            fitBiggest:true,
            rows:[
                newDeviceInfoDatatable(device_info_parser),
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

        this.$ready.push(()=>{this.$$("info").bind(config.context.devices);});
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout);
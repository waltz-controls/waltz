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
    if (device.id === undefined) return false;

    var info = get_device_info(device);

    const properties = await device.fetchProperties();

    info.push({
        id:"properties",
        info: "Properties",
        value:"",
        open: true,
        data:properties.map(property => ({info:property.name, value:property.values.join(",")}))
    });

    info.push({
        id:'alias',
        info: 'Alias',
        value: device.display_name
    });

    this.clearAll();
    this.parse(info);
}


const toolbar = {
    view: "toolbar",
    cols:[
        {},
        {
            view: "button",
            value: "Add",
            type: "icon",
            icon: "plus",
            maxWidth: 30,
            tooltip: "Add new property",
            click(){
                this.getTopParentView().addNewProperty();
            }
        },
        {
            view: "button",
            type: "icon",
            maxWidth:30,
            icon: "save",
            click(){
                this.getTopParentView().save();
            }
        }
    ]
};


const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    deviceRecord: new webix.DataRecord(),
    addNewProperty(){
        const $$info = this.$$('info');
        $$info.editStop();
        const id = $$info.add({
            info: "New property",
            value: ""
        },0,"properties");
        $$info.open("properties");
        $$info.editRow(id)
    },
    saveProperties(properties){
        if(properties.data.length === 0) return;

        const data = {};
        properties.data
            .filter(property => property.value)
            .forEach(property => {
                data[property.info] = (property.value.split) ? property.value.split(',') : property.value;
            });

        const deleteProperties = properties.data
            .filter(property => !property.value)
            .map(property => property.info);

        webix.promise.all([
                UserAction.writeDeviceProperties(this.deviceRecord.data, data),
                UserAction.deleteDeviceProperties(this.deviceRecord.data, deleteProperties)
            ]).then(()=>
                device_info_parser.bind(this.$$('info'))(this.deviceRecord.data)
            ).fail(TangoWebappHelpers.error);
    },
    save(){
        const values = this.$$('info').serialize();
        const properties = values.find(value => value.id === "properties");
        if(properties !== undefined) this.saveProperties(properties)

        //TODO alias
    },
    _ui(){

        return {
            rows:[
                TangoWebapp.ui.newInfoDatatable(device_info_parser),
                toolbar
            ]
        }
    },
    $init:function(config){
        webix.extend(config, this._ui());

        this.$ready.push(()=>{this.$$("info").bind(config.context.devices);});
        this.$ready.push(()=>{this.deviceRecord.bind(config.context.devices);});
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout);
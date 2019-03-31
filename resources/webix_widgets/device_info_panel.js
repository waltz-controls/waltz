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

function device_info_parser (device){
    if (device.id === undefined) return false;
    function get_device_info(device){
        var result = [];

        result.push({
            info: 'Alias',
            value: device.display_name
        });

        kDevice_info_values.forEach(function(item){
            result.push({
                info: MVC.String.classize(item),
                value: device.info[item]
            })
        });

        return result;
    }

    var info = get_device_info(device);
    this.clearAll();
    this.parse(info);
}


//TODO
const device_info_panel = webix.protoUI({
    name:"device_info_panel",
    _ui(){
        return {
            rows:[
                TangoWebapp.ui.newInfoDatatable(device_info_parser),
                {
                    maxHeight:40,
                    template: "form"
                }
            ]
        }
    },
    $init:function(config){
        webix.extend(config, this._ui());

        this.$ready.push(()=>{this.$$("info").bind(config.context.devices);});
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.layout);
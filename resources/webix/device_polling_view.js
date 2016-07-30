webix.protoUI({
    refresh: function () {
        var map = function (el) {
            var lines = el.split('\n');
            return {
                name    : lines[0].split(' = ')[1],
                isPolled: true,
                period  : lines[1].split(' = ')[1]
            };
        };

        var f = function (resp) {
            return function(collection,type) {
                    var polled = resp.output.filter(function (el) {
                        return el.indexOf(type + " name") > -1
                    }).map(map);

                    TangoWebapp.helpers.iterate(collection, function(id, item){
                        var found = polled.find(function(el){
                            return el.name === item.name;
                        });

                        if(found) collection.updateItem(id, found);
                    });
            }
        };

        this.getTopParentView()._admin.then(function (admin) {
            return admin.executeCommand("DevPollStatus", this._device.name);
        }.bind(this.getTopParentView())).then(function (resp) {
            f(resp)(this._commands,'command');
            f(resp)(this._attributes,'attribute');
        }.bind(this.getTopParentView()));
    },
    apply:function(){
        var top = this.getTopParentView();

        var device_name = top._device.name;

        //TODO UpdObjPolling???
        TangoWebapp.helpers.iterate(top._commands, function(el, item){
            if(item.isPolled)
                this._admin.then(function(admin){
                    admin.executeCommand("AddObjPolling","["+item.period+"]["+device_name+",command,"+item.name+"]");
                });
        }.bind(top));
        TangoWebapp.helpers.iterate(top._attributes, function(el, item){
            if(item.isPolled)
                this._admin.then(function(admin){
                    admin.executeCommand("AddObjPolling","["+item.period+"]["+device_name+",attribute,"+item.name+"]");
                });
        }.bind(top));
    },
    reset: function(){
        var device_name = this._device.name;

        TangoWebapp.helpers.iterate(this._commands, function(el, item){
                this._admin.then(function(admin){
                    admin.executeCommand("RemObjPolling",[device_name,"command",item.name]);
                });
        }.bind(this));
        TangoWebapp.helpers.iterate(this._attributes, function(el, item){
                this._admin.then(function(admin){
                    admin.executeCommand("RemObjPolling",[device_name,"attribute",item.name]);
                });
        }.bind(this));

        webix.alert({
            title:"Confirm reset",
            type:"alert-warning",
            text:"Done. Restart " +device_name+ "!"
        });
    },
    _getUI : function () {
        var top = this;
        return {
            rows: [
                {
                    height: 5
                },
                {
                    view : "tabview",
                    cells: [
                        {
                            header: "Commands",
                            body  : {
                                id     : "commands",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: "name", header: "Command", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: "isPolled", header: "Is Polled", template:"{common.checkbox()}"},
                                    {id: "period", header: "Period (ms)", fillspace: true, editor: "text"}
                                ],
                                rules:{
                                    "period": webix.rules.isNumber
                                }
                            }
                        },
                        {
                            header: "Attributes",
                            body  : {
                                id     : "attributes",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: "name", header: "Attribute", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: "isPolled", header: "Is Polled", template:"{common.checkbox()}"},
                                    {id: "period", header: "Period (ms)", fillspace: true, editor: "text"}
                                ],
                                rules:{
                                    "period": webix.rules.isNumber
                                }
                            }
                        },
                        {
                            header: "Settings",
                            body  : {
                                id     : "settings",
                                editable   : true,
                                view   : "datatable",
                                columns: [
                                    {header: "Parameters name", editor: "text"},
                                    {header: "Value", editor: "text"}
                                ]

                            }
                        }
                    ]
                },
                {
                    view: "toolbar",
                    cols: [
                        {
                            view : "button",
                            id   : "btnRefresh",
                            value: "Refresh",
                            width: 100,
                            align: "left",
                            click: top.refresh
                        },
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left", click: top.apply},
                        {view: "button", id: "btnReset", value: "Reset", width: 100, align: "left", click: function(){
                            webix.confirm({
                                title:"Confirm reset",
                                ok:"Yes",
                                cancel:"No",
                                type:"confirm-error",
                                text:"This will reset configuration for all commands and attributes.\n Continue?",
                                callback:function(ok){
                                    if(ok)
                                        top.callEvent('onResetConfirmed');
                                }
                            });
                        }}]
                }
            ]
        }
    },
    name   : "DevicePolling",
    map    : function (arg) {
        return arg.map(function (el) {
            return {
                name    : el.name,
                isPolled: false,
                period  : ""
            }
        });
    },
    $init  : function (config) {
        webix.extend(config, this._getUI());

        this._commands = new webix.DataCollection();
        this._commands.parse(config.device.commands().then(this.map));

        this._attributes = new webix.DataCollection();
        this._attributes.parse(config.device.attributes().then(this.map));

        this._admin = config.device.info().then(function (info) {
            return new Device("dserver/" + info.server);
        });

        this.$ready.push(function () {
            this.$$commands = this.$$('commands');
            this.$$attributes = this.$$('attributes');
            this.$$settings = this.$$('settings');

            this.$$commands.data.sync(this._commands);
            this.$$attributes.data.sync(this._attributes);
        }.bind(this));

        this.$ready.push(this.refresh);
    },
    defaults:{
        on:{
            onResetConfirmed:function(){
                this.reset();
            }
        }
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.mixin.DeviceTabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.ui.newDevicePolling = function (device) {
    return {
        device: device,
        view  : "DevicePolling",
        id    : "device_polling"
    }
};
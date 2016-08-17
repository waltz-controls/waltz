webix.protoUI({
    _change:{},
    _archive: {},
    _periodic: {},
    refresh:function(){
        var top = this.getTopParentView();
        var device = top._device;

        top.$$change.clearAll();
        top.$$archive.clearAll();
        top.$$periodic.clearAll();
        device.attributesInfo()
        .then(function(){
            TangoWebapp.helpers.iterate(device.attributeInfoCollection, function(id, info){

                this._change[id] = this.$$change.add({
                    name: info.name,
                    abs_change: info.events.ch_event.abs_change,
                    rel_change: info.events.ch_event.rel_change
                });

                this._archive[id] = this.$$archive.add({
                    masterId: id,
                    name: info.name,
                    abs_change: info.events.arch_event.abs_change,
                    rel_change: info.events.arch_event.rel_change,
                    period: info.events.arch_event.period
                });

                this._periodic[id] = this.$$periodic.add({
                    masterId: id,
                    name: info.name,
                    period: info.events.per_event.period
                });
            }.bind(top));
        });

    },
    apply:function(){
        var top = this.getTopParentView();

        var device = top._device;

        TangoWebapp.helpers.iterate(device.attributeInfoCollection, function(id, info){
            //change
            info.events.ch_event.abs_change =  this.$$change.getItem(this._change[id]).abs_change;
            info.events.ch_event.rel_change =  this.$$change.getItem(this._change[id]).rel_change;
            //archive
            info.events.arch_event.abs_change = this.$$archive.getItem(this._archive[id]).abs_change;
            info.events.arch_event.rel_change = this.$$archive.getItem(this._archive[id]).rel_change;
            info.events.arch_event.period = this.$$archive.getItem(this._archive[id]).period;
            //periodic
            info.events.per_event.period = this.$$periodic.getItem(this._periodic[id]).period;

            device.attributeInfoCollection.updateItem(id, info);

            device.updateAttributeInfo(info.name);
        }.bind(top));
    },
    _getUI: function () {
        var top = this;
        return {
            rows: [
                {
                    height: TangoWebapp.consts.TABS_DELIMITER_HEIGHT
                },
                {
                    view : "tabview",
                    cells: [
                        {
                            header: "Change event",
                            body  : {
                                id: "ch_event",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {
                                        id: 'abs_change',
                                        header: "Absolute",
                                        editor: "text",
                                        width: TangoWebapp.consts.NAME_COLUMN_WIDTH
                                    },
                                    {
                                        id: 'rel_change', header: "Relative", fillspace: true, editor: "text"
                                    }
                                ]
                            }
                        },
                        {
                            header: "Archive event",
                            body  : {
                                id     : "arch_event",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'abs_change', header: "Absolute", editor: "text", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'rel_change', header: "Relative", editor: "text", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'period', header: "Period (ms)", fillspace: true, editor: "text"}
                                ]
                            }
                        },
                        {
                            header: "Periodic event",
                            body  : {
                                id     : "per_event",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'period', header: "Period (ms)", fillspace: true, editor: "text"}
                                ]
                            }
                        }
                    ]
                },
                {
                    view: "toolbar",
                    cols: [
                        {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left", click: top.refresh},
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left", click: top.apply}]
                }

            ]
        }
    },
    name  : "DeviceEvent",
    $init : function (config) {
        webix.extend(config, this._getUI());

        this.$ready.push(function () {
            this.$$change = this.$$('ch_event');
            this.$$archive = this.$$('arch_event');
            this.$$periodic = this.$$('per_event');

            this.refresh();
        }.bind(this));
    }
}, webix.IdSpace, TangoWebapp.mixin.TabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.ui.newDeviceEvents = function (device) {
    return {
        device: device,
        view  : "DeviceEvent",
        id    : "device_events"
    }
};
webix.protoUI({
    refresh:function(){
        var top = this.getTopParentView();
        var device = top._device;

        var attributesInfo = device.attributes().then(function (attrs) {
            return webix.promise.all(attrs.map(function (attr) {
                return device.attributeInfo(attr.name);
            }));
        });

        var map_change = function (attr) {
            return {
                name      : attr.name,
                abs_change: attr.events.ch_event.abs_change,
                rel_change: attr.events.ch_event.rel_change
            }
        };
        var map_archive = function (attr) {
            return {
                name           : attr.name,
                arch_abs_change: attr.events.arch_event.abs_change,
                arch_rel_change: attr.events.arch_event.rel_change,
                arch_period    : attr.events.arch_event.period
            }
        };

        var map_periodic = function (attr) {
            return {
                name  : attr.name,
                period: attr.events.per_event.period
            }
        };

        top.$$change.parse(attributesInfo.then(function (attrs) {
                return attrs.map(map_change);
            }
        ));

        top.$$archive.parse(attributesInfo.then(function (attrs) {
                return attrs.map(map_archive)
            }
        ));

        top.$$periodic.parse(attributesInfo.then(function (attrs) {
                return attrs.map(map_periodic)
            }
        ));
    },
    apply:function(){
        var top = this.getTopParentView();

        var device = top._device;

        webix.assert(false, "Not yet implemented!")
    },
    _getUI: function () {
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
                            header: "Change event",
                            body  : {
                                id     : "change",
                                view   : "datatable",
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'abs_change', header: "Absolute"},
                                    {id: 'rel_change', header: "Relative", fillspace: true}
                                ]

                            }
                        },
                        {
                            header: "Archive event",
                            body  : {
                                id     : "archive",
                                view   : "datatable",
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'arch_abs_change', header: "Absolute"},
                                    {id: 'arch_rel_change', header: "Relative"},
                                    {id: 'arch_period', header: "Period (ms)", fillspace: true}
                                ]
                            }
                        },
                        {
                            header: "Periodic event",
                            body  : {
                                id     : "periodic",
                                view   : "datatable",
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'period', header: "Period (ms)", fillspace: true}
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
            this.$$change = this.$$('change');
            this.$$archive = this.$$('archive');
            this.$$periodic = this.$$('periodic');

            this.refresh();
        }.bind(this));
    }
}, webix.IdSpace, TangoWebapp.mixin.DeviceTabActivator, TangoWebapp.mixin.DeviceSetter, webix.ui.layout);

TangoWebapp.newDeviceEvents = function (device) {
    return {
        device: device,
        view  : "DeviceEvent",
        id    : "device_events"
    }
};
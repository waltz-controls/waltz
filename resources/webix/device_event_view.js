webix.editors.events = webix.extend({
    getValue:function(){
        var value =  this.getInputNode(this.node).value;

         debugger

        return value;
    },
    setValue:function(value){
        debugger;
        this.getInputNode(this.node).value = value;
    }

},webix.editors.text);

webix.protoUI({
    refresh:function(){
        var top = this.getTopParentView();
        var device = top._device;

        device.attributesInfo();
    },
    apply:function(){
        var top = this.getTopParentView();

        var device = top._device;



        webix.assert(false, "Not yet implemented!")
    },
   _updateAttrEvents:function(event_type){
        return function(editor, value){
            debugger;
            var top = this.getTopParentView();
            var item = top._device.attributeInfoCollection.getItem(editor.row);
            item.events[event_type][editor.column] = value;
            top._device.attributeInfoCollection.updateItem(editor.row,item);
        }
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
                                id: "change",
                                view: "datatable",
                                editable: true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {
                                        id: 'abs_change',
                                        header: "Absolute",
                                        editor: "events",
                                        width: TangoWebapp.consts.NAME_COLUMN_WIDTH,
                                        template: function (attr) {
                                            return attr.events.ch_event.abs_change;
                                        }
                                    },
                                    {
                                        id: 'rel_change', header: "Relative", fillspace: true, editor: "text",
                                        template: function (attr) {
                                            return attr.events.ch_event.rel_change;
                                        }
                                    }
                                ],
                                on: {
                                    onEditorChange: top._updateAttrEvents('ch_event')
                                }
                            }
                        },
                        {
                            header: "Archive event",
                            body  : {
                                id     : "archive",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'arch_abs_change', header: "Absolute", editor: "text", width: TangoWebapp.consts.NAME_COLUMN_WIDTH,
                                    template:function(attr){ return attr.events.arch_event.abs_change;}},
                                    {id: 'arch_rel_change', header: "Relative", editor: "text", width: TangoWebapp.consts.NAME_COLUMN_WIDTH,
                                        template:function(attr){ return attr.events.arch_event.rel_change;}},
                                    {id: 'arch_period', header: "Period (ms)", fillspace: true, editor: "text",
                                        template:function(attr){ return attr.events.arch_event.period;}}
                                ],
                                on:{
                                    onEditorChange:top._updateAttrEvents('arch_event')
                                }
                            }
                        },
                        {
                            header: "Periodic event",
                            body  : {
                                id     : "periodic",
                                view   : "datatable",
                                editable   : true,
                                columns: [
                                    {id: 'name', header: "Attribute name", width: TangoWebapp.consts.NAME_COLUMN_WIDTH},
                                    {id: 'period', header: "Period (ms)", fillspace: true, editor: "text",
                                        template:function(attr){ return attr.events.per_event.period;}}
                                ],
                                on:{
                                    onEditorChange:top._updateAttrEvents('per_event')
                                }

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

            this.$$change.sync(this._device.attributeInfoCollection);
            this.$$archive.sync(this._device.attributeInfoCollection);
            this.$$periodic.sync(this._device.attributeInfoCollection);

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
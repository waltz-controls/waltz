TangoWebapp.DevicePropertiesView = {
    refresh              : function () {
        $$('device_properties').refresh(TangoWebapp.getDevice());
    },
    apply                : function () {
        var data = {};

        var dtable = $$('device_properties').$$('device_properties_data');
        dtable.eachRow(function (rowId) {
            var row = dtable.getItem(rowId);
            data[row.name] = (row.values.split) ? row.values.split(',') : row.values;
        });

        TangoWebapp.getDevice().updateProperties(data);
    },
    openNewPropertyPopup : function () {
        $$('device_properties')._newPropertyPopup.show();
    },
    closeNewPropertyPopup: function () {
        $$('device_properties')._newPropertyPopup.hide();
    },
    addNewProperty       : function () {
        var form = $$('device_properties').$$('newPropertyForm');
        if (!form.validate()) {
            webix.message("Fields must not be empty!", "error");
            return;
        }

        var values = form.getValues();

        $$('device_properties').$$('device_properties_data').add(values);

        TangoWebapp.DevicePropertiesView.closeNewPropertyPopup();
    },
    remove               : function () {
        var dtable = $$('device_properties').$$('device_properties_data');

        dtable.getSelectedId(true).forEach(function (el) {
            TangoWebapp.getDevice().deleteProperty(dtable.getItem(el).name);
        });

        dtable.remove(dtable.getSelectedId());
    }
};

webix.protoUI({
    name: "Device Properties",
    refresh          : function (device) {
        var dtable = this.$$('device_properties_data');
        dtable.clearAll();
        dtable.parse(device.properties());
    },
    newPropertyPopup : function () {
        return webix.ui({
            view: "popup",
            id  : "newPropertyPopup",
            body: {
                view    : "form",
                id      : "newPropertyForm",
                width   : 300,
                elements: [
                    {view: "text", name: "name", label: "Name", validate: webix.rules.isNotEmpty},
                    {view: "text", name: "values", label: "Value", validate: webix.rules.isNotEmpty},
                    {
                        margin: 5, cols: [
                        {
                            view : "button",
                            id   : "btnNewPropertyAdd",
                            value: "OK",
                            type : "form",
                            click: TangoWebapp.DevicePropertiesView.addNewProperty
                        },
                        {view: "button", value: "Cancel", click: TangoWebapp.DevicePropertiesView.closeNewPropertyPopup}
                    ]
                    }
                ]
            }
        });
    },
    _newPropertyPopup: null,
    bind:function(){
        this.$$('device_properties_data').bind(TangoWebapp.devices, '$data', function(device, devices){
            this.clearAll();
            if (!device) return;
            this.parse(device.properties());
        });
    },
    $init:function(){
        this._newPropertyPopup = this.newPropertyPopup();
        this.$ready.push(this.bind);
    },
    defaults: {
        rows: [
            {
                view: "datatable",
                id:"device_properties_data",
                select     : "row",
                multiselect: true,
                editable   : true,
                columns: [
                    {id: "name", header: "Property name", minWidth: 200},
                    {id: "values", header: "Value", fillspace: true, editor: "text"}
                ],
                dataFeed: '...'
            },
            {
                view: "toolbar",
                id: "devPropertiesToolbar",
                cols: [
                    {
                        view : "button",
                        id   : "btnRefresh",
                        value: "Refresh",
                        width: 100,
                        align: "left",
                        click: TangoWebapp.DevicePropertiesView.refresh
                    },
                    {
                        view : "button",
                        id   : "btnApply",
                        value: "Apply",
                        width: 100,
                        align: "left",
                        click: TangoWebapp.DevicePropertiesView.apply
                    },
                    {
                        view : "button",
                        id   : "btnNewProperty",
                        value: "New Property",
                        width: 100,
                        align: "left",
                        click: TangoWebapp.DevicePropertiesView.openNewPropertyPopup
                    },
                    //{view: "button", id: "btnCopy", value: "Copy", width: 100, align: "left"},
                    {
                        view : "button",
                        id   : "btnDelete",
                        value: "Delete",
                        width: 100,
                        align: "left",
                        click: TangoWebapp.DevicePropertiesView.remove
                    }]
            }
        ]
    }
}, webix.IdSpace, webix.EventSystem, TangoWebapp.DeviceTabActivator, webix.ui.layout);

TangoWebapp.DevicePropertiesViewConfig = {
    view: "Device Properties",
    id: "device_properties"
};


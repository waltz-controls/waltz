/** @module DevicePropertiesView */
(function () {
    var device_properties = webix.protoUI({
        name: "device_properties",
        refresh: function () {
            var deviceProperties = this.getTopParentView();
            var dtable = deviceProperties.$$('device_properties_data');
            dtable.clearAll();
            dtable.parse(deviceProperties._device.fetchProperties());
        },
        apply: function () {
            var data = {};

            var dtable = this.getTopParentView().$$('device_properties_data');
            dtable.eachRow(function (rowId) {
                var row = dtable.getItem(rowId);
                data[row.name] = (row.values.split) ? row.values.split(',') : row.values;
            });

            this.getTopParentView()._device.putProperties(data).fail(TangoWebappHelpers.error);
        },
        addNewProperty: function () {
            var form = this.getTopParentView().$$('frmNewProperty');
            if (!form.validate()) {
                webix.message("Fields must not be empty!", "error");

                return;
            }

            form.save();
        },
        remove: function () {
            var deviceProperties = this.getTopParentView();
            var dtable = deviceProperties.$$('device_properties_data');

            dtable.getSelectedId(true).forEach(function (el) {
                deviceProperties._device.deleteProperty(dtable.getItem(el).name);
            });

            dtable.remove(dtable.getSelectedId());
        },
        _device: null,
        _ui: function () {
            var top = this;
            return {
                rows: [
                    {
                        view: "datatable",
                        id: "device_properties_data",
                        select: "row",
                        multiselect: true,
                        editable: true,
                        columns: [
                            {id: "name", header: "Property name", width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH},
                            {id: "values", header: "Value", fillspace: true, editor: "text"}
                        ],
                        dataFeed: '...'
                    },
                    {
                        view: "form",
                        id: "frmNewProperty",
                        elements: [
                            {
                                margin: 5,
                                cols: [
                                    {
                                        view: "button",
                                        id: "btnNewPropertyAdd",
                                        value: "Add",
                                        type: "form",
                                        click: top.addNewProperty, maxWidth: 100
                                    },
                                    {view: "text", name: "name", validate: webix.rules.isNotEmpty, width: 200},
                                    {view: "text", name: "values", validate: webix.rules.isNotEmpty, fillspace: true}
                                ]
                            }
                        ]
                    },
                    {
                        view: "toolbar",
                        id: "devPropertiesToolbar",
                        cols: [
                            {
                                view: "button",
                                id: "btnRefresh",
                                value: "Refresh",
                                width: 100,
                                align: "left",
                                click: top.refresh
                            },
                            {
                                view: "button",
                                id: "btnApply",
                                value: "Apply",
                                width: 100,
                                align: "left",
                                click: top.apply
                            },
                            {
                                view: "button",
                                id: "btnDelete",
                                value: "Delete",
                                width: 100,
                                align: "left",
                                click: top.remove
                            }]
                    }
                ]
            }
        },
        $init: function (config) {
            webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.$$('device_properties_data').parse(this._device.fetchProperties());
            }.bind(this));
            this.$ready.push(function () {
                this.$$('frmNewProperty').bind(this.$$('device_properties_data'));
            }.bind(this));
        }
    }, webix.IdSpace, webix.EventSystem, TangoWebappPlatform.mixin.DeviceSetter, TangoWebappPlatform.mixin.TabActivator, webix.ui.layout);

    TangoWebapp.ui.newDevicePropertiesView = function (device) {
        return {
            device: device,
            view: "device_properties",
            id: "device-properties"
        }
    };
})();


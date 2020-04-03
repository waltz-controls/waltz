/** @module DevicePropertiesView
 *  @memberof ui
 */
(function () {
    function newPropertiesDatatable() {
        return {
            view: "datatable",
            id: "device_properties_data",
            select: "row",
            multiselect: true,
            editable: true,
            columns: [
                {id: "name", header: "Property", editor: "text", width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH},
                {id: "values", header: "Value", editor: "text", fillspace: true}
            ],
            rules: {
                name: webix.rules.isNotEmpty,
                values: webix.rules.isNotEmpty
            },
            on: {
                onAfterEditStop(data, obj) {
                    if (obj.column === "name")
                        this.data.changeId(obj.row, this.getTopParentView().config.device.id + "/" + data.value);
                }
            }
        }
    };

    const toolbar = {
        view: "toolbar",
        id: "devPropertiesToolbar",
        cols: [
            {
                view: "button",
                id: "btnRefresh",
                value: "Refresh",
                width: 100,
                click(){
                    this.getTopParentView().refresh();
                }
            },
            {
                view: "button",
                id: "btnApply",
                value: "Apply",
                css:"webix_primary",
                width: 100,
                click(){
                    this.getTopParentView().apply();
                }
            },
            {},
            {
                view: "button",
                id: "btnNewPropertyAdd",
                value: "Add",
                width: 100,
                click(){
                    this.getTopParentView().addNewProperty()
                }
            },
            {
                view: "button",
                id: "btnDelete",
                value: "Delete",
                width: 100,
                click(){
                    this.getTopParentView().remove();
                }
            }
        ]
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.DevicePropertiesView
     * @namespace device_properties
     */
    var device_properties = webix.protoUI(
        /** @lends device_properties */
        {
        name: "device_properties",
        /** @memberof ui.DevicePropertiesView.device_properties */
        refresh: function () {
            this.config.device.fetchProperties();
        },
        /** @memberof ui.DevicePropertiesView.device_properties */
        apply: function () {
            var data = {};

            var dtable = this.$$('device_properties_data');
            dtable.editStop();
            dtable.eachRow(function (rowId) {
                var row = dtable.getItem(rowId);
                if(row)
                    data[row.name] = (row.values.split) ? row.values.split(',') : row.values;
            });

            this.config.device.putProperties(data)
                .fail(TangoWebappHelpers.error);
        },
        /** @memberof ui.DevicePropertiesView.device_properties */
        addNewProperty: function () {
            const $$properties = this.$$('device_properties_data');
            $$properties.editStop();
            const id = $$properties.add({
                name: "New property",
                values: ""
            });
            $$properties.editRow(id);
        },
        /** @memberof ui.DevicePropertiesView.device_properties */
        remove: function () {
            var dtable = this.$$('device_properties_data');

            const data = dtable.getSelectedItem(true);

            Promise.all(
                data.map(item => item.name).map(prop_name => {
                    this.config.device.deleteProperty(prop_name)
                })
            )
                .fail(TangoWebappHelpers.error);
        },
        _ui: function () {
            return {
                rows: [
                    newPropertiesDatatable(),
                    toolbar
                ]
            }
        },
        /**
         * @memberof ui.DevicePropertiesView.device_properties
         * @constructor
         */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(() => {
                this.$$('device_properties_data').data.sync(this.config.device.properties);
            });
        }
    }, webix.IdSpace, webix.EventSystem, TangoWebappPlatform.mixin.DeviceSetter, TangoWebappPlatform.mixin.TabActivator, webix.ui.layout);
    /**
     * @param device
     * @memberof ui.DevicePropertiesView
     */
    TangoWebapp.ui.newDevicePropertiesView = function (device) {
        return {
            device: device,
            view: "device_properties",
            id: "device-properties"
        }
    };
})();


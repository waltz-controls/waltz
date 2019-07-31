import newToolbar from "./attrs_monitor_toolbar.js";
import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";

const kPersistentColumns = ["id", "device", "remove"];
const kOverlayDelayTimeout = 3000;

export const TableWidgetController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newTableWidgetTab({id:'table_widget'}));
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){
        // const host = await PlatformContext.rest.fetchHost("localhost:10000");
        // const device = await host.fetchDevice("sys/tg_test/1");
        // let attr = await device.fetchAttr("double_scalar");
        //
        //
        // $$('table_widget').addAttribute(attr);
        //
        // attr = await device.fetchAttr("long_scalar");
        // $$('table_widget').addAttribute(attr);

    }
};

//disable Xenv widget for master
// TableWidgetController.initialize();

const table_datatable = webix.protoUI({
    name:"table_datatable",
    _config() {
        return {
            editable: true,
            columns: [
                {id: "id", hidden: true},
                {id: "device", header: "Device", fillspace: true},
                {
                    id: "remove", header: "<span class='remove-all webix_icon fa-trash'></span>", width: 30,
                    tooltip: "Remove all",
                    template: function (obj) {
                        return "<span class='remove-single webix_icon fa-trash'></span>";
                    }
                }
            ],
            on:{
                onHeaderClick(obj){
                    if(obj.column === 'remove'){
                        this.getTopParentView().clear();
                    }
                },
                onItemClick(id) {
                    const device_id = id.row;

                    PlatformContext.devices.setCursor(device_id);


                    const attr_name = id.column;


                    if(kPersistentColumns.includes(attr_name)) return;

                    const attrId = `${device_id}/${attr_name}`;
                    OpenAjax.hub.publish("tango_webapp.item_selected", {
                        data: {
                            id: attrId,
                            kind: 'attrs'
                        }
                    });

                    this.getTopParentView().selectAttribute(attrId);
                },
                onAfterEditStop(value, editor) {
                    if (value.value == value.old) return;

                    const id = `${editor.row}/${editor.column}`;

                    const attr = TangoAttribute.find_one(id);
                    UserAction.writeAttribute(attr, value.value);
                }
            }
        }
    },
    clear(){
        this.clearAll();
    },
    addColumn(attr){
        const columns = this.config.columns;
        const attrColumnConfig = {
            device_id: attr.device_id,
            id: attr.name,
            header: `${attr.display_name} (${attr.info.display_unit})`,
            template:function(obj){
                //TODO move to schema type
                function getQualityIcon(obj){
                    switch (obj[attr.name + "_quality"]) {
                        case "ATTR_ALARM":
                        case "ATTR_INVALID":
                            return `<span class="webix_icon fa-exclamation-triangle" style="color: red"></span>`;
                        case "ATTR_WARNING":
                            return `<span class="webix_icon fa-exclamation-triangle" style="color: orange"></span>`;
                        case "FAILURE":
                            return `<span class="webix_icon fa-exclamation" style="color: red"></span>`;
                        case "VALID":
                        default:
                            return "";
                    }
                }

                return `${getQualityIcon(obj)}${obj[attr.name]}`;
            },
            fillspace: true
        };
        if (attr.isWritable()) webix.extend(attrColumnConfig, {
            editor: "text"
        });
        columns.splice(columns.length - 1, 0, attrColumnConfig);
        this.refreshColumns();
    },
    _tracked_attrs:new Set([]),
    /**
     *
     * @param {TangoAttribute} attr
     */
    addAttribute(attr){
        if(this.config.columns.filter(column => column.id === attr.name).length === 0)
            this.addColumn(attr);

        const item = this.getItem(attr.device_id);
        if(item ===  undefined)
            this.add({
                id: attr.device_id,
                device: attr.getDevice().display_name,
                [attr.name]: "",
                [attr.name + "_quality"]: "",
                _device: attr.getDevice(),
                _attrs:new Set(this._tracked_attrs)
            });

        this._tracked_attrs.add(attr.name);
        this.data.each(item => item._attrs.add(attr.name));

        this.run();
    },
    /**
     *
     * @param name
     * @return {string} removed attr name
     */
    removeAttribute(name){
        const col = this.config.columns.find(col => col.header[0].text.includes(name));
        const index = this.config.columns.indexOf(col);
        if (index > -1) {
            this.config.columns.splice(index, 1);
        } else {
            throw new Error("assertion error");
        }

        this.refreshColumns();

        this._tracked_attrs.delete(col.id);
        this.data.each(item => item._attrs.delete(col.id));
        return col.id;
    },
    async addDevice(id){
        let device = TangoDevice.find_one(id);
        if(device == null) {
            try {
                const parts = id.split('/');
                const tango_host = parts.shift();
                device = await PlatformContext.rest.fetchHost(tango_host)
                    .then(host => host.fetchDevice(parts.join('/')))
            } catch (e) {
                TangoWebappHelpers.error(`Failed to fetch device[id=${id}]`,e);
                return;
            }
        }

        if(this.exists(device.id)) return;
        this.add({
            id: device.id,
            device: device.display_name,
            _device: device,
            _attrs:new Set(this._tracked_attrs)
        });

        this.run();
    },
    removeDevice(id){
        this.remove(id);
        return false;
    },
    run(){
        this.data.each(item => {
            item._device.fetchAttrValues([...item._attrs]).then(resp => {
                const update = {};
                resp.forEach(output => {
                    update[output.name] = output.value;
                    update[output.name + "_quality"] = output.quality;
                });

                //TODO remove failed attrs

                this.updateItem(item.id, update);
            })
        });
    },
    $init(config) {
        webix.extend(config, this._config());


    }
}, webix.ui.datatable);



const stateful_table_datatable = webix.protoUI({
    name:"stateful_table_datatable",
    getInitialState(){
        return {
            attrs: [],
            devices: []
        }
    },
    restoreState(state){
        if(state.data.devices.length === 0 && state.data.attrs.length > 0) //this may happen when user cleared tha table and then refreshed the app
            this.state.setState({
                attrs: [],
                devices: []
            });

        state.data.devices.forEach(device_id => {
            state.data.attrs
                .map(name => device_id + "/" + name)
                .forEach(async attrId => {
                    PlatformContext.rest.fetchAttr(attrId)
                        .then(attr => this.getTopParentView().addAttribute(attr, true));
                })
        })
    },
    clear(){
        webix.ui.table_datatable.prototype.clear.apply(this, arguments);
        this.state.updateState({
            devices: []
        });
    },
    addAttribute(attr){
        webix.ui.table_datatable.prototype.addAttribute.call(this, attr);
        const attrs = this.state.data.attrs;
        if(!attrs.includes(attr.name))
            attrs.push(attr.name);
        const devices = this.state.data.devices;
        if(!devices.includes(attr.device_id))
            devices.push(attr.device_id);
        this.state.setState(this.state.data);
    },
    removeAttribute(display_name){
        const name = webix.ui.table_datatable.prototype.removeAttribute.call(this, display_name);
        const attrs = this.state.data.attrs;
        const index = attrs.indexOf(name);
        if (index > -1) {
            attrs.splice(index, 1);
        }
        this.state.setState(this.state.data);
    },
    addDevice(id){
        webix.ui.table_datatable.prototype.addDevice.call(this, id);
        const devices = this.state.data.devices;
        if(!devices.includes(id))
            devices.push(id);
        this.state.setState(this.state.data);
    },
    removeDevice(id){
        webix.ui.table_datatable.prototype.removeDevice.call(this, id);
        const devices = this.state.data.devices;
        const index = devices.indexOf(id);
        if (index > -1) {
            devices.splice(index, 1);
        }
        this.state.setState(this.state.data);
    },
    getStateId() {
        return this.config.stateId || this.config.id;
    }
},TangoWebappPlatform.mixin.Stateful,table_datatable);

function newTableWidgetTable(config) {
    return {
        id:"datatable",
        stateId: config.id,
        view:"stateful_table_datatable",
        onClick: {
            "remove-single":function(event, id){
                this.getTopParentView().removeDevice(id.row);
            }
        }
    }
}

const input_holder = webix.protoUI({
    name: "table_widget_input",
    _ui(){
        return {
            hidden: true,
            rows:[
                {
                    maxHeight:20,
                    cols:[
                        {},
                        {
                            view:"button",
                            type:"icon",
                            icon:"times",
                            width:20,
                            click(){
                                this.getFormView().hide();
                            }
                        }
                    ]
                },
                {
                id: "input_holder", rows:[
                    {}
                ]
            }]
        }
    },
    setAttribute(attr){
        this.attr = attr;
        if(!attr) return;

        if(attr.info.writable.includes('WRITE')) {
            this.$$input = $$(webix.ui([{view: "scalar_input", attr, borderless: true}], this.$$('input_holder'))[0].id);

            this.show();
        } else {
            this.hide();
        }

        attr.read().then(resp => this.$$input.setValue(resp.value));
    },
    $init(config) {
        webix.extend(config, this._ui());
    },
},webix.IdSpace,webix.ui.form);

function newScalarInput(){
    return {
        view: 'table_widget_input',
        id: 'input'

    }
}

const table_widget = webix.protoUI({
    name: "table_widget",
    _ui(config) {
        return {
            rows:[
                newTableWidgetTable(config),
                newScalarInput(),
                newRemoveAttributeSettings(),
                newToolbar(toolbar_extension())
            ]
        }
    },
    showOverlay(msg){
        const $$datatable = this.$$('datatable');
        $$datatable.disable();
        // $$datatable.showOverlay(msg);
        webix.message({expire:kOverlayDelayTimeout, text:msg});
        setTimeout(() => {
            $$datatable.enable();
            // $$datatable.hideOverlay();
        },kOverlayDelayTimeout);
    },
    selectAttribute(id){
        const attr = TangoAttribute.find_one(id);
        if(attr === null) throw new Error("assertion error");

        this.$$('input').setAttribute(attr);
    },
    removeAttribute(name){
        const $$settings = this.$$('settings');
        const $$datatable = this.$$('datatable');
        const readonly = !$$settings.getValues().editable;
        if(readonly) {
            this.showOverlay("<span class='webix_icon fa-trash'></span>TableWidget is not editable...\n Please check 'Editable' box!");
            return;
        }
        $$datatable.removeAttribute(name);
        $$settings.removeAttribute(name);
    },
    addAttribute(attr, force = false){
        const $$datatable = this.$$('datatable');
        const $$settings = this.$$('settings');
        const readonly = !$$settings.getValues().editable;
        if(readonly && !force) {
            this.showOverlay("TableWidget is not editable...\n Please check 'Editable' box!");
            return;
        }
        if(!attr.isScalar()) {
            this.showOverlay("Only SCALAR attributes are supported by this widget!");
            return;
        }

        $$datatable.addAttribute(attr, force);
        $$settings.addAttribute(attr.display_name, force);
    },
    addDevice(id){
        const readonly = !this.$$('settings').getValues().editable;
        if(readonly) {
            this.showOverlay("TableWidget is not editable...\n Please check 'Editable' box!");
            return;
        }
        this.$$('datatable').addDevice(id);
        this.$$('settings').addDevice(id);
    },
    removeDevice(id){
        const readonly = !this.$$('settings').getValues().editable;
        if(readonly) {
            this.showOverlay("TableWidget is not editable...\n Please check 'Editable' box!");
            return;
        }
        this.$$('datatable').removeDevice(id);
    },
    clear(){
        const readonly = !this.$$('settings').getValues().editable;
        if(readonly) {
            this.showOverlay("TableWidget is not editable...\n Please check 'Editable' box!");
            return;
        }
        this.$$('datatable').clear();
    },
    run(){
        this.$$('datatable').run();
    },
    $init(config){
        webix.extend(config, this._ui(config));

        this.$ready.push(()=>{
            webix.event(this.getNode(), "click", function(e){
                this.run();
            }, {bind:this});
        });

        this.addDrop(this.getNode(),{
            /**
             * @function
             * @memberof  ui.AttrsMonitorView.attrs_monitor_view
             * @see {@link https://docs.webix.com/api__dragitem_onbeforedrop_event.html| onBeforeDrop}
             */
            $drop:function(source, target){
                const dnd = webix.DragControl.getContext();
                if(dnd.from.config.$id === 'attrs') {
                    const attr = TangoAttribute.find_one(dnd.source[0]);
                    if (attr == null) return false;

                    this.addAttribute(attr);
                } else if(dnd.from.config.view === 'devices_tree_tree'){
                    this.addDevice(dnd.source[0]);
                } else {
                    this.showOverlay(`${dnd.from.config.$id} are not supported by this widget`);
                }
                
                return false;
            }.bind(this)
        });
    }

}, TangoWebappPlatform.mixin.Runnable, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newTableWidgetBody(config){
    return webix.extend({
                view: "table_widget"

    },config);
}

export function newTableWidgetTab(config){
    return {
        header: "<span class='webix_icon fa-table'></span> TableWidget",
        borderless: true,
        body: newTableWidgetBody(config)

    };
}
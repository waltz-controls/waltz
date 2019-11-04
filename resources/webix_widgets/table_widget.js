import newToolbar from "./attrs_monitor_toolbar.js";
import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";
import {TangoId} from "../../models/platform/tango_id.js";

const kPersistentColumns = ["id", "device", "remove"];
const kOverlayDelayTimeout = 3000;
const kFrozenOverlayMessage = "<span class='webix_icon fa-bell'></span>This TableWidget's configuration is frozen...<br/> Please uncheck 'Frozen' box!";

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

function respToUpdate(update, resp){
    update[resp.name + "_quality"] = resp.quality;
    if(!resp.errors)
        update[resp.name] = resp.value;

    //TODO error
    return update;
}

//disable Xenv widget for master
// TableWidgetController.initialize();

/**
 *
 * @param {String} attr
 */
function getColumnConfig(attr){
    return {
        id: attr,
        header: `${attr}`, //TODO redefine header once attr info is loaded ${attr.display_name} (${attr.info.display_unit})
        template:function(obj){
            //TODO move to schema type
            function getQualityIcon(obj){
                switch (obj[attr + "_quality"]) {
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

            return `${getQualityIcon(obj)}${obj[attr]}`;
        },
        fillspace: true
    };
    //TODO set writeable once attr info is loaded
    // if (attr.isWritable()) webix.extend(attrColumnConfig, {
    //     editor: "text"
    // });

}

async function selectDevice(deviceId){
    const device = PlatformContext.devices.getItem(deviceId);
    if(device === undefined) {
        await PlatformContext.rest.fetchDevice(deviceId)
    }


    PlatformContext.devices.setCursor(deviceId);
}

/**
 *
 * @param attrId
 * @return {Promise<TangoAttribute>}
 */
function loadAttribute(attrId){
    const tangoId = TangoId.fromAttributeId(attrId);

    return PlatformContext.rest.request()
        .hosts(tangoId.tangoHost.replace(':','/'))
        .devices(tangoId.deviceName)
        .attributes(tangoId.memberName)
        .get('/info')
        .then(resp => {
            return new TangoAttribute({
                id: attrId,
                name: tangoId.memberName,
                device_id: tangoId.deviceId,
                info: resp
            })
        })
}

const table_datatable = webix.protoUI({
    name:"table_datatable",
    _config() {
        return {
            editable: true,
            drag: true,
            resizeColumn: true,
            dragColumn: true,
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
                async onItemClick(id) {
                    //TODO refactor - split and extract
                    const device_id = id.row;

                    await selectDevice(device_id);

                    const attr_name = id.column;


                    if(kPersistentColumns.includes(attr_name)) return;

                    const attrId = `${device_id}/${attr_name}`;
                    this.getTopParentView().selectAttribute(attrId)
                        .then(() => {
                        OpenAjax.hub.publish("tango_webapp.item_selected", {
                            data: {
                                id: attrId,
                                kind: 'attrs'
                            }
                        });
                    });
                },
                onAfterEditStop(value, editor) {
                    if (value.value == value.old) return;

                    const id = `${editor.row}/${editor.column}`;

                    const attr = TangoAttribute.find_one(id);
                    UserAction.writeAttribute(attr, value.value);
                },
                onBeforeDrop(context){
                    if(context.from === this) return true;
                    if(context.from.config.$id === 'attrs') {
                        const attr = TangoAttribute.find_one(context.source[0]);
                        if (attr != null) {
                            this.getTopParentView().addAttribute(attr);
                        }
                    } else if(context.from.config.view === 'devices_tree_tree'){
                        this.getTopParentView().addDevice(context.source[0]);
                    } else {
                        this.getTopParentView().showOverlay(`${context.from.config.$id} are not supported by this widget`);
                    }

                    return false;
                }
            }
        }
    },
    clear(){
        this.clearAll();
    },
    addColumn(attr){
        const columns = this.config.columns;
        const attrColumnConfig = getColumnConfig(attr.name);
        attrColumnConfig.header = `${attr.display_name} (${attr.info.display_unit})`;
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
                [attr.name + "_quality"]: ""
            });

        this._tracked_attrs.add(attr.name);

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
            device: device.display_name
        });

        this.run();
    },
    removeDevice(id){
        this.remove(id);
        return false;
    },
    run(){
        this.hideProgress();
        this.showProgress({
            type:"top",
            delay: 500,
            hide:true
        });
        this.data.each(item => {
            const tangoId = TangoId.fromDeviceId(item.id);

            const attrs = this.config.columns.slice(1,this.config.columns.length - 1);//skip the first: device and the last one - remove
            PlatformContext.rest.request()
                .hosts(tangoId.tangoHost.replace(':','/'))
                .devices(tangoId.deviceName)
                .attributes('value')
                .get('?' + attrs.map(function (attr) {
                    return "attr=" + attr.id
                }).join('&'))
                .then(resp => {
                    const update = resp.reduce(respToUpdate, {});
                    this.updateItem(item.id, update);
                })
                .fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
            })
    },
    $init(config) {
        webix.extend(config, this._config());


    }
}, webix.ui.datatable);



const stateful_table_datatable = webix.protoUI({
    name:"stateful_table_datatable",
    getInitialState(){
        return {
            hide_settings: false,
            frozen: false,
            attrs: [],
            devices: []
        }
    },
    _restoreAttrs(attrs){
        const columns = this.config.columns;
        columns.splice.apply(columns,[columns.length - 1, 0].concat(attrs.map(getColumnConfig)));
        this.refreshColumns();

        const $$settings = this.getTopParentView().$$('settings');
        attrs.forEach(attr => $$settings.addAttribute(attr, true));
    },
    _restoreDevices(devices){
        this.parse(devices.map(device_id => {
            const tangoId = TangoId.fromDeviceId(device_id);

            return {
                id: device_id,
                device: tangoId.deviceName
            }
        }));
    },
    restoreState(state){
        if(state.data.devices.length === 0 && state.data.attrs.length > 0) //this may happen when user cleared tha table and then refreshed the app
            this.state.updateState({
                attrs: [],
                devices: []
            });

        this.showProgress({
            type:"top",
            delay: 3000,
        });

        this._restoreAttrs(state.data.attrs);

        this._restoreDevices(state.data.devices);

        this.getTopParentView().frozen = state.data.frozen;

        if(state.data.hide_settings)
            this.getTopParentView().hideSettings();

        this.run();
    },
    setFrozen(value){
        this.state.updateState({
            frozen: value
        });
    },
    clear(){
        webix.ui.table_datatable.prototype.clear.apply(this, arguments);
        this.state.updateState({
            devices: []
        });
    },
    async addAttribute(attr){
        await webix.ui.table_datatable.prototype.addAttribute.call(this, attr);
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
    async addDevice(id){
        await webix.ui.table_datatable.prototype.addDevice.call(this, id);
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
},TangoWebappPlatform.mixin.Stateful,webix.ProgressBar,table_datatable);

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
    get frozen(){
        return this.$$('settings').getValues().frozen
    },
    set frozen(value){
        this.$$('datatable').setFrozen(value);
        this.$$('settings').setValues({
            frozen: value
        })
    },
    get state(){
        return this.$$('datatable').state;
    },
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
        if(attr === null) {
            return loadAttribute(id)
                .then(attr => {
                    const columnConfig = this.$$('datatable').getColumnConfig(attr.name);
                    if(attr.isWritable() && columnConfig.editor !== "text"){
                        webix.extend(
                            columnConfig,
                            {
                                editor: "text"
                            }
                        );
                        this.$$('datatable').refreshColumns();
                    }
                })
                .then(attr => {
                    this.$$('input').setAttribute(attr);
                })
                .fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
        } else{
            const columnConfig = this.$$('datatable').getColumnConfig(attr.name);
            if(attr.isWritable() && columnConfig.editor !== "text") {
                webix.extend(
                    columnConfig,
                    {
                        editor: "text"
                    }
                );
                this.$$('datatable').refreshColumns();
            }

            this.$$('input').setAttribute(attr);
            return webix.promise.resolve(attr);
        }
    },
    removeAttribute(name){
        const $$settings = this.$$('settings');
        const $$datatable = this.$$('datatable');
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        $$datatable.removeAttribute(name);
        $$settings.removeAttribute(name);
    },
    async addAttribute(attr, force = false){
        if(this.frozen && !force) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        if(!attr.isScalar()) {
            this.showOverlay("Only SCALAR attributes are supported by this widget!");
            return;
        }

        const $$datatable = this.$$('datatable');
        await $$datatable.addAttribute(attr, force);

        const $$settings = this.$$('settings');
        $$settings.addAttribute(attr.display_name, force);
    },
    async addDevice(id){
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        await this.$$('datatable').addDevice(id);
        this.$$('settings').addDevice(id);
    },
    removeDevice(id){
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        this.$$('datatable').removeDevice(id);
    },
    clear(){
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
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

            const $$settings = this.$$('settings');
            $$settings.addView({
                name: "frozen",
                view: "checkbox",
                label: "Frozen",
                labelPosition: "top",
                tooltip: "Enables/disables changes of this table i.e. add/remove attributes etc",
                value: false,
                click(){
                    this.getTopParentView().frozen = this.getValue();//TODO bind to table_widget field
                }
            });
            $$settings.getChildViews()[0].define({
                width: 1
            });
            $$settings.getChildViews()[0].resize();
        });
    }

},/*TODO Statefull*/ TangoWebappPlatform.mixin.Runnable, TangoWebappPlatform.mixin.ToggleSettings, webix.IdSpace, webix.ui.layout);

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

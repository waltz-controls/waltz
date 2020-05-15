import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";
import {newToolbar, Runnable, ToggleSettings, WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {TangoAttribute} from "models/tango";
import {kChannelLog, kTopicLog} from "controllers/log";
import {kActionSelectTangoDevice} from "widgets/tango/actions";

const kPersistentColumns = ["id", "device", "remove"];
const kOverlayDelayTimeout = 3000;

const kTableWidgetHeader = "<span class='webix_icon mdi mdi-table-large'></span> TableWidget";
const kRemoveAllHeader = "<span class='remove-all webix_icon wxi-trash'></span>";
const kRemoveSingleHeader = "<span class='remove-single webix_icon wxi-trash'></span>";

const kAlertInvalid = `<span class="webix_icon mdi mdi-alert" style="color: red"></span>`;
const kAlertWarning = `<span class="webix_icon mdi mdi-alert" style="color: orange"></span>`;
const kAlertFailure = `<span class="webix_icon mdi mdi-alert-octagram-outline" style="color: red"></span>`;

function devicesTreeIdToTangoId(tree, id){
    const item = tree.getItem(id);
    const host = tree.getTangoHostId(item);

    return TangoId.fromDeviceId(`${host}/${item.device_name}`)
}


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
 * @param {TangoAttribute} attr
 */
function getColumnConfig(attr){
    return webix.extend({
        id: attr.name,
        header: `${attr.name} (${attr.info.display_unit})`, //TODO redefine header once attr info is loaded ${attr.display_name} (${attr.info.display_unit})
        template:function(obj){
            //TODO move to schema type
            function getQualityIcon(obj){
                switch (obj[attr.name + "_quality"]) {
                    case "ATTR_ALARM":
                    case "ATTR_INVALID":
                        return kAlertInvalid;
                    case "ATTR_WARNING":
                        return kAlertWarning;
                    case "FAILURE":
                        return kAlertFailure;
                    case "VALID":
                    default:
                        return "";
                }
            }

            return `${getQualityIcon(obj)}${obj[attr.name]}`;
        },
        fillspace: true
    }, attr.isWritable() ? {editor:"text"} : {});
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
                    id: "remove",
                    header: kRemoveAllHeader,
                    width: 30,
                    tooltip: "Remove all",
                    template: function (obj) {
                        return kRemoveSingleHeader;
                    }
                }
            ],
            on:{
                onHeaderClick(obj){
                    if(obj.column === 'remove'){
                        this.config.root.clear();
                    }
                },
                onItemClick(id) {
                    const device_id = TangoId.fromDeviceId(id.row);

                    this.config.root.dispatch(device_id,kActionSelectTangoDevice);
                },
                onAfterEditStop(value, editor) {
                    if (value.value == value.old) return;

                    const id = TangoId.fromMemberId(`${editor.row}/${editor.column}`);

                    this.config.root.writeAttribute(id, value.value);
                },
                onBeforeDrop(context){
                    if(context.from === this) return true;
                    if(context.from.config.view === 'device_tree_list' &&
                        context.from.config.$id === 'attrs') {
                            this.config.root.addAttribute(TangoId.fromMemberId(context.source[0]));
                    } else if(context.from.config.view === 'devices_tree' &&
                        (context.from.getItem(context.source[0]).isAlias || context.from.getItem(context.source[0]).isMember)){
                        this.config.root.addDevice(devicesTreeIdToTangoId(context.from, context.source[0]));
                    } else {
                        this.getTopParentView().showOverlay(`${context.from.config.$id} are not supported by this widget`);
                    }

                    return false;
                }
            }
        }
    },
    addColumns(attrs){
        const columns = this.config.columns;

        const configs = attrs.map(attr => getColumnConfig(attr));

        columns.splice(columns.length - 1, 0, ...configs);
        this.refreshColumns();
    },
    addColumn(attr){
        this.addColumns([attr])
    },
    /**
     *
     * @param {TangoAttribute} attr
     */
    async addAttribute(attr){
        if(this.config.columns.filter(column => column.id === attr.name).length === 0)
            this.addColumn(attr);

        const item = this.getItem(attr.tango_id.getTangoDeviceId());
        if(item ===  undefined){
            await this.config.root.addDevice(attr.tango_id);
            this.updateItem(attr.tango_id.getTangoDeviceId(), {
                [attr.name]: "",
                [attr.name + "_quality"]: ""
            })
            }

        this.run();
    },
    /**
     *
     * @param {string} name
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
        return col.id;
    },
    /**
     *
     * @param {TangoDevice} device
     * @return {Promise<void>}
     */
    addDevice(device){
        if(this.exists(device.id)) return;
        this.add({
            id: device.id,
            device: device.alias || device.name
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
        this.data.each(async item => {
            const tangoId = TangoId.fromDeviceId(item.id);

            const attrs = this.config.columns.slice(1,this.config.columns.length - 1);//skip the first: device and the last one - remove
            const rest = await this.getTangoRest();
                rest.newTangoDevice(tangoId).toTangoRestApiRequest()
                .attributes('value')
                .get('?' + attrs.map(function (attr) {
                    return "attr=" + attr.id
                }).join('&'))
                .toPromise()
                .then(resp => {
                    const update = resp.reduce(respToUpdate, {});
                    this.updateItem(item.id, update);
                })
                .catch((resp) => {
                    this.config.root.dispatchError(resp,kTopicLog,kChannelLog);
                });
            })
    },
    $init(config) {
        webix.extend(config, this._config());
    }
}, WaltzWidgetMixin, webix.ProgressBar, webix.ui.datatable);


function newTableWidgetTable(config) {
    return {
        id:"datatable",
        root: config.root,
        stateId: config.id,
        view:"table_datatable",
        onClick: {
            "remove-single":function(event, id){
                this.config.root.removeDevice(TangoId.fromDeviceId(id.row));
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
                            view:"icon",
                            icon:"wxi-close",
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
                newRemoveAttributeSettings(config),
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
    run(){
        this.$$('datatable').run();
    },
    $init(config){
        webix.extend(config, this._ui(config));


        this.$ready.push(() => {
            webix.event(this.getNode(), "click", function(e){
                this.run();
            }, {bind:this});
        });

        this.$ready.push(()=>{
            const $$settings = this.$$('settings');
            $$settings.addView({
                name: "frozen",
                view: "checkbox",
                label: "Frozen",
                labelPosition: "top",
                tooltip: "Enables/disables changes of this table i.e. add/remove attributes etc",
                value: false,
                click(){
                    config.root.setFrozen(this.getValue(), true);//TODO bind to table_widget field
                }
            });
            $$settings.getChildViews()[0].define({
                width: 1
            });
            $$settings.getChildViews()[0].resize();
        });
    }

}, Runnable, ToggleSettings, WaltzWidgetMixin, webix.IdSpace, webix.ui.layout);

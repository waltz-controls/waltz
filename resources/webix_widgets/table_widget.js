import newToolbar from "./attrs_monitor_toolbar.js";

const kPersistentColumns = ["id", "device", "remove"];

export const TableWidgetController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newTableWidgetTab());
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){
        const host = await PlatformContext.rest.fetchHost("localhost:10000");
        const device = await host.fetchDevice("sys/tg_test/1");
        let attr = await device.fetchAttr("double_scalar");


        $$('table_widget').addAttribute(attr);

        attr = await device.fetchAttr("long_scalar");
        $$('table_widget').addAttribute(attr);

    }
};

//disable Xenv widget for master
TableWidgetController.initialize();

const table_datatable = webix.protoUI({
    name:"table_datatable",
    _config() {
        return {
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
                        this.clear();
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
                }
            }
        }
    },
    clear(){
        this.clearAll();
        this._tracked_attrs = new Set([]);
        this.removeColumns();
    },
    removeColumns(){
        const columns = this.config.columns;
        this.config.columns = columns.filter(column => kPersistentColumns.includes(column.id));
        this.refreshColumns();
    },
    addColumn(attr){
        const columns = this.config.columns;
        columns.splice(columns.length - 1,0,{
            device_id: attr.device_id,
            id: attr.name,
            header: `${attr.display_name} (${attr.info.display_unit})`,
            template:function(obj){
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
        });
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

function newTableWidgetTable(){
    return {
        id:"datatable",
        view:"table_datatable",
        onClick: {
            "remove-single":function(event, id){
                this.remove(id.row);
                if(this.count() === 0) this.removeColumns();
                return false;
            }
        }
    }
}

const settings = webix.protoUI({
    name: "table_widget_settings",
    _config(){
        return {
            cols:[{}]
        }
    },
    removeAttribute(name){
        const col = this.queryView({label:name});
        this.removeView(col);
    },
    addAttribute(attr){
        const col = this.queryView({label:attr.display_name});
        if(col !== null) return;
        this.addView({
            view:"button",
            type:"icon",
            icon:"trash",
            label: attr.display_name,
            click(){
                this.getTopParentView().removeAttribute(this.data.label);
            }
        });
    },
    addDevice(id){
        //NOP
    },
    $init(config){
        webix.extend(config, this._config());
    }
    },webix.ui.form);

function newSettings() {
    return {
        view: "table_widget_settings",
        id: "settings",
        hidden: true
    };
}

//TODO extract
function toolbar_extension(){
    return [{
        view: "button",
        type: "icon",
        icon: "cog",
        maxWidth: 30,
        tooltip: "Show/hide settings",
        click: function () {
            const $$settings = this.getTopParentView().$$('settings');
            if($$settings.isVisible())
                $$settings.hide();
            else
                $$settings.show();
        }
    }];
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
    _ui(){
        return {
            rows:[
                newTableWidgetTable(),
                newScalarInput(),
                newSettings(),
                newToolbar(toolbar_extension())
            ]
        }
    },
    selectAttribute(id){
        const attr = TangoAttribute.find_one(id);
        if(attr === null) throw new Error("assertion error");

        this.$$('input').setAttribute(attr);
    },
    removeAttribute(name){
        this.$$('datatable').removeAttribute(name);
        this.$$('settings').removeAttribute(name);
    },
    addAttribute(attr){
        if(!attr.isScalar()) {
            webix.message("Only SCALAR attributes are supported by this widget!");
            return;
        }
        this.$$('datatable').addAttribute(attr);
        this.$$('settings').addAttribute(attr);
    },
    addDevice(id){
        this.$$('datatable').addDevice(id);
        this.$$('settings').addDevice(id);
    },
    run(){
        this.$$('datatable').run();
    },
    $init(config){
        webix.extend(config, this._ui());

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
                }
                if(dnd.from.config.view === 'devices_tree_tree'){
                    this.addDevice(dnd.source[0]);
                }
                return false;
            }.bind(this)
        });
    }

}, TangoWebappPlatform.mixin.Runnable, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newTableWidgetTab(){
    return {
        header: "<span class='webix_icon fa-table'></span> TableWidget",
        borderless: true,
        body:
            {
                id: "table_widget",
                view: "table_widget"
            }
    };
}
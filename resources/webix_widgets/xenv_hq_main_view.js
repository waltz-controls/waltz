import newSearch from "./search.js";
import {DataSource} from "./xenv_models.js";
import newToolbar from "./attrs_monitor_toolbar.js";

/**
 *
 *
 * @param {DataSource} dataSource
 * @param {string} value
 * @function
 */
const filterDataSourcesList = (dataSource, value)=>{
    if(!value) return true;
    return dataSource.src.includes(value) || dataSource.nxPath.includes(value);
};

function newSortButton(by) {
    return {
        view: "button",
        //TODO requires webix 6.x
        // css: "webix_transparent",
        type: "icon",
        label: `<span class='webix_strong'>${MVC.String.classize(by)}</span>`,
        dir: "asc",
        click() {
            this.getTopParentView().$$('listDataSources').sort(by, this.config.dir);
            this.config.dir = this.config.dir === "asc" ? "desc" : "asc";
        }
    }
}

function newSort() {
    return {
        view: "form",
        height: 30,
        cols: [
            {
                view: "label",
                label: "Sort by:",
                maxWidth: 80,
            },
            newSortButton('src'),
            newSortButton('nxPath'),
            {}
        ]
    }
}

const dataSourcesView = {
    padding: 15,
    rows: [
        {
            template: "Nexus file data sources",
            type: "header"
        },
        newSort(),
        newSearch("listDataSources", filterDataSourcesList),
        {
            view: "list",
            id: "listDataSources",
            template:
                "<span class='webix_strong'>Src: </span>#src#<br/>" +
                "<span class='webix_strong'>nxPath: </span>#nxPath#",
            gravity: 4,
            type: {
                height: "auto"
            },
            on: {
                onItemClick(id){
                    if(this.getSelectedId() === id){
                        this.unselectAll();
                    } else {
                        this.select(id);
                    }
                },
                onBlur(){
                    const $$hq = this.getTopParentView().getTopParentView();
                    $$hq.pushConfiguration();
                },
                onAfterAdd: function (obj) {
                    const $$hq = this.getTopParentView();
                    $$hq.addDataSource(this.getItem(obj));
                },
                onDataUpdate: function (obj) {
                    const $$hq = this.getTopParentView();
                    $$hq.addDataSource(this.getItem(obj));
                },
                onBeforeDelete: function (obj) {
                    const $$hq = this.getTopParentView();
                    $$hq.removeDataSource(this.getItem(obj));
                }
            }
        },
        {
            view: "form",
            id: "frmDataSource",
            on:{
                onBindApply(obj){
                    if(!obj) return;
                    this.setValues({
                        srcScheme:this.elements['srcScheme'].getList().find(option => obj.src.startsWith(option.value), true).value,
                        srcPath  : obj.src.substring(obj.src.indexOf(':') + 1)
                    }, true);
                },
                onBeforeValidate(){
                    this.setValues({
                        src: `${this.elements['srcScheme'].getValue()}${this.elements['srcPath'].getValue()}`
                    },true);
                }
            },
            elements: [
                {cols:[
                        { view: "label", label: "src", maxWidth: 80 },
                        {view: "combo", name: "srcScheme", maxWidth: 120, options: [
                                "tine:", "tango:", "predator:", "external:"
                            ], validate: webix.rules.isNotEmpty},
                        {view: "text", name: "srcPath"},
                    ]},
                {view: "text", name: "nxPath", label: "nxPath", validate: webix.rules.isNotEmpty},
                {
                    view: "radio", name: "type", label: "type", options: [
                        "scalar", "spectrum", "log"
                    ], validate: webix.rules.isNotEmpty
                },
                {view: "text", name: "pollRate", label: "pollRate", validate: webix.rules.isNumber},
                {
                    view: "select", name: "dataType", label: "dataType", options: [
                        "string", "int16", "int32", "int64", "uint16", "uint32", "uint64", "float32", "float64"
                    ]
                },
                {
                    cols: [
                        {},
                        {
                            view: "button", width: 30, type: "icon", icon: "save", tooltip: "save", click: obj => {
                                const $$hq = $$(obj).getTopParentView();
                                $$hq.$$('frmDataSource').save();
                            }
                        },
                        {
                            view: "button", width: 30, type: "icon", icon: "clone", tooltip: "clone", click: obj => {
                                const $$hq = $$(obj).getTopParentView();

                                if(!$$hq.$$('frmDataSource').validate()) return;

                                const cloned = $$hq.$$('frmDataSource').getValues();
                                cloned.id = webix.uid();

                                $$hq.$$('listDataSources').add(cloned);
                            }
                        },
                        {
                            view: "button", width: 30, type: "icon", icon: "trash", tooltip: "delete", click: obj => {
                                const $$hq = $$(obj).getTopParentView();
                                const $$frm = $$hq.$$('frmDataSource');
                                const id = $$frm.getValues().id;
                                $$frm.clear();
                                $$hq.$$('listDataSources').remove(id);
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const xenvServersView = {
    padding: 15,
    rows: [
        {
            template: "X-Environment Servers",
            type: "header"
        },
        {
            view: "list",
            id: "listServers",
            drag: "order",
            /**
             *
             * @param {XenvServer} obj
             */
            template:
                `<div style="margin: 2em">
                    <span class="webix_strong">#name#, device: #ver#</span><br>
					State:  | <span class="webix_strong" style="{common.stateHighlightColor()}">#state#</span> | <br/>
					Status: |  <span>#status#</span> |<br>
                    </div>`
            ,
            type: {
                height: "auto",
                stateHighlightColor: obj => {
                    switch (obj.state) {
                        case "ON":
                            return "background-color: #9ACD32";
                        case "RUNNING":
                            return "background-color: #6B8E23; color: white";
                        case "ALARM":
                            return "background-color: #FFFF00";
                        case "FAULT":
                            return "background-color: #B22222; color: white";
                        case "STANDBY":
                            return "background-color: #FFD700";
                        case "UNKNOWN":
                        default:
                            return "background-color: #D3D3D3";
                    }
                }
            },
            on: {
                onItemClick(id) {
                    const device = this.getItem(id).device;
                    PlatformContext.devices.setCursor(device.id);

                    PlatformApi.PlatformUIController().expandDeviceTree();
                },
                onItemDblClick(id) {
                    //TODO open tab with configuration, log etc
                }
            }
        },
        newToolbar()
    ]
};

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/9/19
 */
const main = webix.protoUI({
    name: "main",
    _ui(){
        return {
            cols:[
                dataSourcesView,
                xenvServersView
            ]
        }
    },
    get servers(){
        return this.$$('listServers');
    },
    get data(){
        return this.$$('listDataSources');
    },
    clearAll(){
        this.$$('listDataSources').clearAll();
        this.$$('frmDataSource').clear();
    },
    /**
     *
     * @param {DataSource} dataSource
     */
    addDataSource: async function(dataSource){
        const createDataSourceCmd = await this.config.configurationManager.device.fetchCommand("createDataSource");

        TangoWebapp.UserAction.executeCommand(createDataSourceCmd, [
            // PlatformContext.UserContext.user,
            dataSource.id,
            dataSource.nxPath,
            dataSource.type,
            dataSource.src,
            dataSource.pollRate,
            dataSource.dataType
        ]).then(() => this.config.master.commitConfiguration());
    },
    /**
     *
     * @param {DataSource} dataSource
     */
    removeDataSource: async function(dataSource){
        const deleteDataSourceCmd = await this.config.configurationManager.device.fetchCommand("removeDataSource");

        TangoWebapp.UserAction.executeCommand(deleteDataSourceCmd,
            dataSource.id
        ).then(() => this.config.master.commitConfiguration());
    },
    run:function(){
        this.servers.data.each(async server => {
            let state, status;
            [state, status]  = await webix.promise.all([
                server.fetchState(),
                server.fetchStatus()
            ]);
            this.servers.updateItem(server.id , {state, status});
        });
    },
    /**
     *
     * @param {string} id
     */
    dropAttr(id){
        const attr = TangoAttribute.find_one(id);
        if(attr == null) return;

        const device = TangoDevice.find_one(attr.device_id);
        const $$list = this.$$('listDataSources');
        $$list.select(
            $$list.add(
                new DataSource(`tango://${attr.id}`,
                    `/entry/hardware/${device.name}/${attr.name}`,
                    "log",
                    200,
                    DataSource.devDataTypeToNexus(attr.info.data_type))));
    },
    $init(config){
        webix.extend(config, this._ui());

        this.$ready.push(()=>{
            this.$$('frmDataSource').bind(this.$$('listDataSources'));
        });

        this.addDrop(this.getNode(),{
            /**
             * @function
             */
            $drop:function(source, target){
                var dnd = webix.DragControl.getContext();
                if(dnd.from.config.$id === 'attrs') {
                    this.dropAttr(dnd.source[0]);
                }

                return false;
            }.bind(this)
        });
    }
}, TangoWebappPlatform.mixin.Runnable, webix.ProgressBar, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newXenvMainBody(config){
    return webix.extend({
        view: "main",
        id:"main_tab"
    },config);
}
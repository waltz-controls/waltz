export const xenvProfileSettings = {
    view: "form",
    id: "frmProfileSettings",
    hidden: true,
    elements: [
        {
            view: "text",
            id: "profile",
            name: "profile",
            label: "Name",
            labelAlign: "right",
            validate: webix.rules.isNotEmpty
        },
        {
            cols: [
                {
                    view: "text",
                    id: "tango_host",
                    name: "tango_host",
                    label: "Host",
                    labelAlign: "right",
                    validate: webix.rules.isNotEmpty
                },
                {
                    view: "text",
                    id: "instance_name",
                    name: "instance_name",
                    label: "Instance",
                    labelAlign: "right",
                    validate: webix.rules.isNotEmpty
                }
            ]
        },
        {
            cols: [
                {},
                {
                    view: "button",
                    id: 'btnAddProfile',
                    type: "icon",
                    icon: "save",
                    maxWidth: 30,
                    click: async function () {
                        const $$frm = this.getFormView();
                        if (!$$frm.validate()) return;

                        const values = $$frm.getValues();

                        await this.getTopParentView().createProfile(values.profile, values.tango_host, values.instance_name);
                    }
                },
                {
                    view: "button",
                    id: 'btnRmProfile',
                    type: "icon",
                    icon: "trash",
                    maxWidth: 30,
                    click: async function () {
                        const $$frm = this.getFormView();
                        if (!$$frm.validate()) return;

                        const values = $$frm.getValues();
                        await this.getTopParentView().deleteProfile(values.profile, values.tango_host, values.instance_name);
                    }
                }
            ]
        }
    ]
};

export const xenvHqToolbar = {
    view: "toolbar",
    maxHeight: 30,
    cols: [
        {
            view: "select",
            id: "profiles",
            label: "Profile",
            options: [],
            on: {
                onChange: function (profile) {
                    this.getTopParentView().selectProfile(profile);
                    webix.message(`Select profile ${profile}`);
                }
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "plus",
            maxWidth: 30,
            click: function () {
                const $$frmProfile = this.getTopParentView().$$('frmProfileSettings');
                if ($$frmProfile.isVisible())
                    $$frmProfile.hide();
                else
                    $$frmProfile.show();
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "refresh",
            maxWidth: 30,
            click: async function () {
                const $$hq = this.getTopParentView();
                $$hq.showProgress({
                    type: "icon",
                    icon: "refresh",
                });
                $$hq.refreshProfiles().then(() => $$hq.hideProgress());
            }
        },
        {
            view: "toggle",
            type: "iconButton",
            onIcon: "stop",
            offIcon: "play",
            maxWidth: 30,
            click: function () {
                if (this.getValue()) {
                    this.getTopParentView().stop();
                } else {
                    this.getTopParentView().start();
                }
            }
        },

        {},
        {
            view: "button",
            type: "icon",
            icon: "cog",
            maxWidth: 30,
            click: function () {
                const $$HQsettings = this.getTopParentView().$$("hq-settings");
                if ($$HQsettings.isVisible())
                    $$HQsettings.hide();
                else
                    $$HQsettings.show();
            }
        }
    ]
};

export const xenvHqSettings = {
    id: 'hq-settings',
    hidden: true,
    rows: [
        {
            id: "main",
            view: "text",
            value: "",
            label: "HQ main",
            labelWidth: 120,
            tooltip: "HQ main",
            labelAlign: "right"
        },
        {
            id: "configuration",
            view: "text",
            value: "",
            label: "HQ configuration manager",
            labelWidth: 120,
            tooltip: "HQ configuration manager",
            labelAlign: "right"
        },
        {
            id: "manager",
            view: "text",
            value: "",
            label: "HQ xenv servers manager",
            labelWidth: 120,
            tooltip: "HQ xenv servers manager",
            labelAlign: "right"
        },
        {
            id: "camel",
            view: "text",
            value: "",
            label: "CamelIntegration",
            labelWidth: 120,
            tooltip: "CamelIntegration",
            labelAlign: "right"
        },
        {
            id: "status_server",
            view: "text",
            value: "",
            label: "StatusServer",
            labelWidth: 120,
            tooltip: "StatusServer",
            labelAlign: "right"
        },
        {
            id: "data_format_server",
            view: "text",
            value: "",
            label: "DataFormatServer",
            labelWidth: 120,
            tooltip: "DataFormatServer",
            labelAlign: "right"
        },
        {
            id: "predator",
            view: "text",
            value: "",
            label: "PreExperimentDataCollector",
            labelWidth: 120,
            tooltip: "PreExperimentDataCollector",
            labelAlign: "right"
        },
        {
            cols: [
                {},
                {
                    view: "button",
                    value: "Apply",
                    maxWidth:120,
                    click(){
                        this.getTopParentView().applySettings();
                    }
                }
            ]
        }
    ]
};

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

export const dataSourcesView = {
    view: "fieldset",
    label: "Data sources",
    body: {
        rows: [
            {
                view: "search",
                placeholder: "type to filter...",
                maxHeight: 30,
                on:{
                    onTimedKeyPress(){
                        this.getTopParentView().$$('listDataSources').filter(filterDataSourcesList, this.getValue())
                    },
                    onFocus(){
                        this.getTopParentView().$$('listDataSources').filter(filterDataSourcesList, this.getValue())
                    }
                }
            },
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
                        const $$hq = this.getTopParentView();
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
    }
};


export const xenvServersView = {
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
        }
    ]
};

export const xenvHqBody = {
    type: "space",
    cols: [
        dataSourcesView,
        xenvServersView
    ]
};

export const xenvHqBottom = {
    view: "button",
    value: "Update & Restart all",
    minHeight: 80,
    click() {
        this.getTopParentView().updateAndRestartAll()
    }
};

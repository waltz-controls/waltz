import {newXenvMainBody} from "./xenv_hq_main_view.js";
import {newStatusServerViewBody} from "./xenv_status_server_view.js";
import {newCamelIntegrationViewBody} from "./xenv_camel_view.js";
import {newPredatorViewBody} from "./xenv_predator_view.js";
import {newDfsViewBody} from "./xenv_dfs_view.js";
import {codemirror_textarea} from "./scripting_console.js";

const xml = webix.protoUI({
    name: "xml",
    update(value){
        if(!value) return;
        this.setValue(value);
    }
},codemirror_textarea);

export function newXmlView(){
    return {
        gravity: 2,
        rows: [
            {
                view: "xml",
                id: "xml",
                mode: "application/xml",
                matchClosing: true
            }
        ]
    }
}

export function newXenvServerLog() {
    return {
        view:"list",
        id:'log',
        type:{
            height: "auto",
            template(obj){
                return `<div>
                            <p>${obj.data}</p>
                            <div><span class="webix_icon fa-clock-o"></span>${obj.timestamp} [${new Date(obj.timestamp)}]</div>
                        </div>`;
            }
        }
    }
}

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

export function newXenvHqBody(config){
    return {
        view: "tabview",
        cells: [
            {
                header: "Main",
                body: newXenvMainBody(config)
            },
            {
                header: "DataFormatServer",
                body: newDfsViewBody(config)
            },
            {
                header: "StatusServer",
                body: newStatusServerViewBody(config)
            },
            {
                header: "CamelIntegration",
                body: newCamelIntegrationViewBody(config)
            },
            {
                header: "PreExperimentDataCollector",
                body: newPredatorViewBody(config)
            }
        ]
    };
}

export const xenvHqBottom = {
    view: "button",
    value: "Update & Restart all",
    minHeight: 80,
    click() {
        this.getTopParentView().updateAndRestartAll()
    }
};

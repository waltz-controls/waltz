/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
import {newTableWidgetBody} from "./table_widget.js";
import {newPlotlyWidgetBody} from "./plotly_widget.js";

export const DashboardWidgetController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newDashboardWidgetTab({id: 'dashboard_widget'}));
    }

    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api) {
        const host = await PlatformContext.rest.fetchHost("localhost:10000");
        const device = await host.fetchDevice("sys/tg_test/1");
        let attr = await device.fetchAttr("double_scalar");


        // $$('dashboard_widget').addAttribute(attr);
        //
        // attr = await device.fetchAttr("long_scalar");
        // $$('dashboard_widget').addAttribute(attr);
    }
};

//disable Xenv widget for master
DashboardWidgetController.initialize();

function newDashboardToolbar() {
    return {
        view: "toolbar",
        maxHeight: 30,
        cols: [
            {
                view: "richselect",
                id: "profiles",
                label: "Profile",
                options: {
                    template: "#value# (#type#)",
                    data:[]
                },
                on: {
                    onChange: function (profileId) {
                        const profile = this.getList().getItem(profileId);
                        if(profile) {//prevent undefined when deleting
                            this.getTopParentView().selectProfile(profile);
                            webix.message(`Select profile ${profile.value}`);
                        }
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
            {}
        ]
    }
}

function newProfileForm() {
    return {
        view: "form",
        id: "frmProfileSettings",
        hidden: true,
        elements: [
            {
                cols: [
                    {
                        view: "text",
                        id: "profileId",
                        name: "id",
                        hidden: true
                    },
                    {
                        view: "text",
                        id: "profile",
                        name: "value",
                        label: "Name",
                        labelAlign: "right",
                        validate: webix.rules.isNotEmpty
                    },
                    {
                        view: "richselect",
                        id: "type",
                        name: "type",
                        label: "Type",
                        labelAlign: "right",
                        options:["table","plot"],
                        value: "table",
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
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();

                            this.getTopParentView().createProfile(values);
                        }
                    },
                    {
                        view: "button",
                        id: 'btnRmProfile',
                        type: "icon",
                        icon: "trash",
                        maxWidth: 30,
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();
                            this.getTopParentView().deleteProfile(values.id);
                        }
                    }
                ]
            }
        ]
    }
}

class Profile{
    constructor(id, value, type, viewId = undefined){
        this.id = id;
        this.value = value;
        this.type = type;
        this.viewId = viewId;
    }
}

function createInnerWidget(type, config){
    switch (type) {
        case "table":
            return newTableWidgetBody(config);
        case "plot":
            return newPlotlyWidgetBody(config);
    }
}

const dashboard_widget = webix.protoUI({
    name: "dashboard_widget",
    initial_state:[
        new Profile(webix.uid(), "default", "table")],
    restoreState(state){
        state.data.forEach(profile => {
            profile.viewId = this.$$("multiview").addView(createInnerWidget(profile.type, {id: profile.id}))
        });
        this.$$("profiles").getList().parse(state.data);
        this.$$("profiles").setValue(state.data[0].id);

    },
    selectProfile(profile){
        this.$$('frmProfileSettings').setValues(profile);
        $$(profile.viewId).show();
    },
    createProfile({value,type}){
        const profile = new Profile(webix.uid(), value, type);

        profile.viewId = this.$$("multiview").addView(createInnerWidget(profile.type, {id: profile.id}));
        this.state.data.push(profile);
        this.state.updateState();

        const $$profiles = this.$$('profiles');
        $$profiles.getList().add(profile);
        $$profiles.setValue(profile.id);
    },
    deleteProfile(id){
        const profile = this.state.data.find(profile => profile.id === id);
        const index = this.state.data.indexOf(profile);
        webix.assert(index > -1, "assertion error: there is no profile with id=" + id);
        this.state.data.splice(index, 1);
        this.state.updateState();

        const $$profiles = this.$$('profiles');
        $$profiles.getList().remove(id);

        this.$$("multiview").removeView(profile.viewId);
    },
    _ui() {
        return {
            rows: [
                newDashboardToolbar(),
                newProfileForm(),
                {
                    view: "multiview",
                    id: "multiview",
                    cells: [
                        {
                            id: "loading",
                            template: "<span class='webix_icon fa-refresh fa-spin'></span>"
                        }
                    ]
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());
    }
}, TangoWebappPlatform.mixin.Stateful, webix.IdSpace, webix.ui.layout);

function newDashboardWidgetBody(config) {
    return webix.extend({
        view: "dashboard_widget"
    }, config);
}

export function newDashboardWidgetTab(config) {
    return {
        header: "<span class='webix_icon fa-dashboard'></span> DashboardWidget",
        borderless: true,
        body: newDashboardWidgetBody(config)

    };
}
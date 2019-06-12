/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
import {newTableWidgetBody} from "./table_widget.js";

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
                        id: "profile",
                        name: "profile",
                        label: "Name",
                        labelAlign: "right",
                        validate: webix.rules.isNotEmpty
                    },
                    {
                        view: "text",//TODO select
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
    }
}

const dashboard_widget = webix.protoUI({
    name: "dashboard_widget",
    _ui() {
        return {
            rows: [
                newDashboardToolbar(),
                newProfileForm(),
                {
                    view: "multiview",
                    cells: [
                        newTableWidgetBody({id: "default"})
                    ]
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());
    }
}, webix.IdSpace, webix.ui.layout);

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
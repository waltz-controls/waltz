/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
// import {newTableWidgetBody} from "./table_widget.js";
// import {newPlotlyWidgetBody} from "./plotly_widget.js";

export const kWidgetDashboardProfilesId = 'widget:dashboard_profiles';
export const kWidgetDashboardProfilesPanelId = 'widget:dashboard_profiles_panel';
export const kWidgetDashboardProfilesPanel = 'widget:dashboard_profiles_panel_top';
const kWidgetDashboardPanelHeader = '<span class="webix_icon mdi mdi-gauge"></span>Dashboard profiles';


export function newDashboardProfilesPanel(dashboard){
    return {
        view: 'accordionitem',
        id: kWidgetDashboardProfilesPanel,
        header: kWidgetDashboardPanelHeader,
        headerAlt: kWidgetDashboardPanelHeader,
        headerHeight: 32,
        headerAltHeight: 32,
        body: {
            id: kWidgetDashboardProfilesPanelId,
            isolate: true,
            rows:[
                {
                    id: kWidgetDashboardProfilesId,
                    view:"list",
                    select: true,
                    template:"#name# (#type#)",
                    url: dashboard.proxy,
                    save: dashboard.proxy,
                    on:{
                        onAfterSelect(id){
                            const profile = this.getItem(id);
                            dashboard.showProfileWidget(profile);
                        },
                        onAfterLoad(){
                            if(this.count() > 0)
                                this.select(this.getFirstId());
                        }
                    }
                },
                {
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
                                    name: "name",
                                    placeholder:"New profile's name",
                                    validate: webix.rules.isNotEmpty
                                }
                            ]
                        }, {
                            cols: [
                                {
                                    view: "richselect",
                                    id: "type",
                                    name: "type",
                                    options: ["table", "plot", "list"],
                                    value: "table",
                                    validate: webix.rules.isNotEmpty
                                },
                                {
                                    view: "icon",
                                    id: 'btnAddProfile',
                                    icon: "wxi-check",
                                    maxWidth: 30,
                                    click() {
                                        const $$frm = this.getFormView();
                                        if (!$$frm.validate()) return;

                                        const values = $$frm.getValues();

                                        dashboard.createProfile(values);
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    borderless: true,
                    view:"toolbar",
                    cols:[
                        {
                            view: "icon",
                            icon: "wxi-trash",
                            maxWidth: 30,
                            tooltip: "Delete selected profile",
                            click() {
                                dashboard.deleteProfile(dashboard.$$profiles.getSelectedId());
                            }
                        },
                        {},
                        {
                            view: "icon",
                            css:"add_profile_icon",
                            icon: "wxi-plus",
                            tooltip: "Show new profile form",
                            maxWidth: 30,
                            click() {
                                const $$frmProfile = this.getTopParentView().$$('frmProfileSettings');
                                if ($$frmProfile.isVisible())
                                    $$frmProfile.hide();
                                else
                                    $$frmProfile.show();
                            }
                        }
                    ]
                }
            ]

        }
    }
}
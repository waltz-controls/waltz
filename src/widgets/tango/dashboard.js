import "views/tango/dashboard_widget";


import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicLog} from "controllers/log";
import TableViewWidget from "./table_view";

const kDashboardHeader = "<span class='webix_icon mdi mdi-gauge'></span> Dashboard";
const kWidgetDashboard = 'widget:dashboard';
const kWidgetDashboardProfilesId = 'widget:dashboard_profiles';
const kWidgetDashboardProfilesPanelId = 'widget:dashboard_profiles_panel';
const kWidgetDashboardProfilesPanel = 'widget:dashboard_profiles_panel_top';

export const mainView = {
    header: kDashboardHeader,
    body: {
        id: kWidgetDashboard,
        view: 'multiview',
        cells: [{
            template: '<span class="webix_icon mdi mdi-spin mdi-loading" data-inline="false"></span> loading...'
        }]
    }
}

class Profile{
    constructor(id, name, type, viewId = undefined){
        this.id = id;
        this.name = name;
        this.type = type;
        this.viewId = viewId;
    }
}

function createInnerWidgetUI(type, config){
    switch (type) {
        case "table":
            return new TableViewWidget(config).ui();
        case "plot":
            return newPlotlyWidgetBody(config);
        case "list":
            return TangoWebapp.ui.newStatefulAttrsMonitorView(config);
    }
}

const kWidgetDashboardPanelHeader = '<span class="webix_icon mdi mdi-gauge"></span>Dashboard profiles';
export default class DashboardWidget extends WaltzWidget {
    constructor() {
        super(kWidgetDashboard);
    }

    /**
     *
     * @return {Promise<UserContext>}
     */
    getUserContext(){
        return this.app.getContext(kUserContext);
    }

    config(){
        this.proxy = {
            $proxy:true,
            load:()=>{
                return this.getUserContext()
                    .then(userContext => userContext.getOrDefault(this.name, []))
            },
            save:(master, params, dataProcessor)=>{
                switch (params.operation) {
                    case "insert":
                        return this.getUserContext()
                            .then(userContext => userContext.updateExt(this.name, ext => ext.push(params.data)))
                            .then(userContext => userContext.save())
                            .then(() => this.dispatch(`Successfully saved new profile ${params.data.name}`,kTopicLog, kChannelLog));
                    case "delete":
                        return this.getUserContext()
                            .then(userContext => userContext.updateExt(this.name, ext => {
                                const index = ext.findIndex(profile => profile.id === params.id)
                                ext.splice(index,1);
                            }))
                            .then(userContext => userContext.save())
                            .then(() => this.dispatch(`Successfully deleted profile ${params.data.name}`,kTopicLog, kChannelLog));
                    default:
                        throw new Error(`Unsupported operation ${params.operation}`);
                }
            }
        }
    }

    panel(){
        const self = this;
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
                        url: this.proxy,
                        save: this.proxy,
                        on:{
                            onAfterSelect(id){
                                const profile = this.getItem(id);
                                self.showProfileWidget(profile);
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

                                            self.createProfile(values);
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
                                    self.deleteProfile(self.$$profiles.getSelectedId());
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

    get $$main() {
        return $$(this.name);
    }

    get $$profiles(){
        return $$(kWidgetDashboardProfilesPanelId).$$(kWidgetDashboardProfilesId)
    }

    run(){
        const panel = $$(kWidgetDashboardProfilesPanel) || $$(this.app.getWidget(kMainWindow).leftPanel.addView(this.panel()));
    }

    showProfileWidget(profile){
        const view = $$(profile.viewId) || $$(profile.viewId = this.$$main.addView(createInnerWidgetUI(profile.type, {id: profile.id, app: this.app})));

        view.show();
    }

    createProfile({name,type}){
        const profile = new Profile(webix.uid(), name, type);

        this.showProfileWidget(profile);

        this.$$profiles.add(profile);
    }

    deleteProfile(id){
        const profile = this.$$profiles.getItem(id);
        this.$$profiles.remove(id);

        $$(profile.viewId).destructor()
    }
}
import {WaltzWidget} from "@waltz-controls/middleware";
import {kWidgetDashboardProfilesId, kWidgetDashboardProfilesPanelId} from "views/tango/dashboard_widget";

const kHintWidget = "widget:hint";

export default class WaltzHintWidget extends WaltzWidget {
    constructor(app) {
        super(kHintWidget,app);
    }

    run(){
        const hint = webix.ui({
            view: "hint",
            id: "hint",
            prevButton: false,
            steps: [
                {
                    el: "left_panel",
                    title: "Welcome to Waltz!",
                    text: "This is your navigation panel. Here you can create new dashboard profiles, explore Tango devices tree, control Tango devices etc...",
                    event:"click"
                },
                {
                    el: "main_view",
                    text: "This is your main view. Here new dashboards will be opened, as well as Tango device attributes, commands etc...",
                    event:"click"
                },
                {
                    el: "right_panel",
                    text: "This is your log panel. Here relevant log entries will appear...",
                    event:"click"
                },
                {
                    el: "$top_toolbar1",
                    text: "This is your menu toolbar. Some useful features can be found here...",
                    event:"click"
                },
                {
                    el: "$top_toolbar1",
                    text: "For more information, please use help menu to go to user documentation. Press 'enter' to continue!",
                    event:"click"
                },
            ]
        });

        const profiles = $$(kWidgetDashboardProfilesPanelId).$$(kWidgetDashboardProfilesId);

        profiles.waitData.then(() => {
            if(profiles.count() === 0)
                hint.start()
        })

    }
}
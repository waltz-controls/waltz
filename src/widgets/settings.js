import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
// import {kSettingsHeaderCogs} from "views/settings";

export const kWidgetSettings = 'widget:settings';
const kSettingsHeaderCogs = "<span class='webix_icon mdi mdi-cogs'></span> Settings";


export default class UserSettingsWidget extends WaltzWidget {
    constructor() {
        super(kWidgetSettings);
    }

    ui() {
        return {
            header: kSettingsHeaderCogs,
            close: true,
            body:
                {
                    id: 'settings',
                    view: "settings"
                }
        }
    }

    open(){
        const settingsId = this.app.getWidget(kMainWindow).mainView.addView(this.ui());



        $$(settingsId).attachEvent('');
    }

}
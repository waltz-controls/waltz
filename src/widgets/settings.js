import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kSettingsHeaderCogs} from "views/settings";
import {kUserContext} from "../controllers/user_context";

export const kWidgetSettings = 'widget:settings';


export const kAddTangoHost = 'action:addTangoHost';

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
                    id: this.name,
                    view: "settings",
                    ...this
                }
        }
    }

    open(){
        this.app.getWidget(kMainWindow).mainView.addView(this.ui());

        $$(this.name).attachEvent(kAddTangoHost, async host => {
            const context = await this.app.getContext(kUserContext);
            context.tango_hosts[host] = null;


            this.dispatchObservable(context.save(),kAddTangoHost, kWidgetSettings);
        });

    }

}
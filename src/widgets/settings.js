import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kSettingsHeaderCogs} from "views/settings";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicError} from "controllers/log";

export const kWidgetSettings = 'widget:settings';


export const kAddTangoHost = 'action:addTangoHost';

export default class UserSettingsWidget extends WaltzWidget {
    constructor() {
        super(kWidgetSettings);
    }

    config(){
        this.listen(host => {
            $$(this.name).$$('tango_hosts').add({id:host,value:host})
        },kAddTangoHost);
    }

    ui() {
        return {
            header: kSettingsHeaderCogs,
            close: true,
            body:
                {
                    id: this.name,
                    view: "settings",
                    root:this
                }
        }
    }

    async addTangoHost(host){
        const context = await this.app.getContext(kUserContext);
        context.tango_hosts[host] = null;

        context.save()
            .then(resp => {
                if (resp.ok)
                    this.dispatch(host, kAddTangoHost);
                else
                    throw new Error(`Failed to save UserContext[${context.user}] due to  ${resp.status}:${resp.statusText}`)
            })
            .catch(err => {
                this.dispatch(err, kTopicError, kChannelLog);
            })
    }

    open(){
        this.app.getWidget(kMainWindow).mainView.addView(this.ui());
    }

}
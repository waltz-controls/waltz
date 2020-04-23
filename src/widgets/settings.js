import {WaltzWidget} from "@waltz-controls/middleware";
import {kSettingsHeaderCogs} from "views/settings";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicError} from "controllers/log";

export const kWidgetSettings = 'widget:settings';


export const kAddTangoHost = 'action:addTangoHost';

export const kRemoveTangoHost = 'action:removeTangoHost';
export const kSelectTangoHost = 'action:selectTangoHost';
export const kApplyDeviceFilters = 'action:applyDeviceFilters';

function saveUserContext(context, action, payload){
    context.save()
        .then(resp => {
            if (resp.ok)
                this.dispatch(payload, action);
            else
                throw new Error(`Failed to save UserContext[${context.user}] due to  ${resp.status}:${resp.statusText}`)
        })
        .catch(err => {
            this.dispatch(err, kTopicError, kChannelLog);
        })
}


export default class UserSettingsWidget extends WaltzWidget {
    constructor() {
        super(kWidgetSettings);
    }

    config(){
        this.listen(host => {
            $$(this.name).$$('tango_hosts').add({id:host,value:host})
        },kAddTangoHost);

        this.listen(host => {
            $$(this.name).$$('tango_hosts').remove(host)
        },kRemoveTangoHost);
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

        saveUserContext.call(this, context, kAddTangoHost, host);
    }

    async removeTangoHost(host){
        const context = await this.app.getContext(kUserContext);
        delete context.tango_hosts[host];

        saveUserContext.call(this, context, kRemoveTangoHost, host);
    }

    selectTangoHost(host){
        this.dispatch(host, kSelectTangoHost);
    }

    async applyDeviceFilters(filters){
        const context = await this.app.getContext(kUserContext);
        context.device_filters = filters;

        saveUserContext.call(this, context, kApplyDeviceFilters, context);
    }

}
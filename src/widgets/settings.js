import {WaltzWidget} from "@waltz-controls/middleware";
import {kSettingsHeaderCogs} from "views/settings";
import {kControllerUserContext} from "controllers/user_context";
import {kTangoRestContext} from "controllers/tango_rest";
import {of} from "rxjs";
import {last, mergeMap} from "rxjs/operators";
import {kMainWindow} from "widgets/main_window";

export const kWidgetSettings = 'widget:settings';


export const kAddTangoHost = 'action:addTangoHost';

export const kRemoveTangoHost = 'action:removeTangoHost';
export const kSelectTangoHost = 'action:selectTangoHost';
export const kApplyDeviceFilters = 'action:applyDeviceFilters';

function saveUserContext(action, payload){
    this.context.save()
        .then(() => {
            this.dispatch(payload, action);
        })
}


export const kAddTangoDevices = 'action:addTangoDevices';
export default class UserSettingsWidget extends WaltzWidget {
    constructor(app) {
        super(kWidgetSettings, app);
        this.context = this.app.getController(kControllerUserContext);

        this.listen(host => {
            $$(this.name).$$('tango_hosts').add({id:host,value:host})
        },kAddTangoHost);

        this.listen(host => {
            $$(this.name).$$('tango_hosts').remove(host)
        },kRemoveTangoHost);

        this.listen(() => {
            debugger
        }, kAddTangoDevices)
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

    run(){
        const tab = $$(this.name) || $$(this.app.getWidget(kMainWindow).mainView.addView(this.ui()));
        tab.show();
    }

    async addTangoHost(host){
        const context = await this.context.get();
        context.tango_hosts[host] = null;

        saveUserContext.call(this, kAddTangoHost, host);
    }

    async removeTangoHost(host){
        const context = await this.context.get();
        delete context.tango_hosts[host];

        saveUserContext.call(this, kRemoveTangoHost, host);
    }

    selectTangoHost(host){
        this.dispatch(host, kSelectTangoHost);
    }

    async applyDeviceFilters(filters){
        const context = await this.context.get();
        context.device_filters = filters;

        saveUserContext.call(this, kApplyDeviceFilters, context);
    }

    async addTangoDevices({host, server, className, devices}){
        const rest = await this.app.getContext(kTangoRestContext);

        const req = rest.newTangoHost({...host.split(':')}).database()
            .pipe(
                mergeMap(db => of(devices.map(name => db.addDevice([server,name,className])))),
                last()
            )

        this.dispatchObservable(req, kAddTangoDevices)
    }

}
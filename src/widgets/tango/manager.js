import "views/tango/astor_view_ui";
import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoHost} from "./actions";
import {kTangoRestContext} from "controllers/tango_rest";
import {kChannelLog, kTopicLog} from "controllers/log";
import {catchError, map, mergeMap, switchMap, tap, toArray} from "rxjs/operators";
import {from, of} from "rxjs";
import {kContextTangoSubscriptions} from "../../controllers/tango_subscriptions";

const kWidgetTangoManager = "widget:tango_manager";

const kManagerHeader = "<span class='webix_icon mdi mdi-format-list-checks'></span> Manager";

const as_array = true;

class TangoServer {
    constructor(id, name, state, level, device) {
        this.id = id;
        this.name = name;
        this._level = level;
        this._state = state;
        this.device = device;
    }

    get level() {
        return this._level === "0" ? "Not controlled" : this._level;
    }

    get state() {
        switch (this._state) {
            case "MOVING":
                return "STARTING/STOPPING";
            case "FAULT":
                return "NOT RUNNING/UNKNOWN";
            default:
                return "RUNNING";
        }
    }
}

export const kUnknownTangoHostState = -1;//see esrf.DevState.java

class TangoAdmin {
    constructor(id, name, promiseDevice) {
        this.id = id;
        this.name = name;
        this.state = kUnknownTangoHostState;
        this.promiseDevice = promiseDevice;
        this.servers = [];
    }
}

class TangoDevice {
    constructor(id, clazz, name, server) {
        this.id = id;
        this.clazz = clazz;
        this.name = name;
        this.server = server;
    }
}

function updateServer([name, _state, controlled, _level]){
    this.view.$$servers.updateItem(`${this.tango_host.id}/dserver/${name}`,{_state,_level});
}

const kSubscriptionTopic = "subscription";
export default class Manager extends WaltzWidget {
    constructor(app) {
        super(kWidgetTangoManager, app);
        this.tango_host = null;//TODO dataRecord?
        this.starter    = null;
        this.subscriptionId = NaN;

        this.listen(id => this.setTangoHost(id), kActionSelectTangoHost);
        this.listen({
            next: (event) => {
                this.refreshHosts();
                updateServer.call(this, event.data.map(el => el.split("\t")))
                this.refreshDevices();
                this.loadLog();
            },
            error: (err) => {
                this.dispatchError(err, kTopicLog, kChannelLog);
            }
        },kSubscriptionTopic,this.name)
    }

    ui(){
        return {
            header: kManagerHeader,
            close: true,
            borderless: true,
            body: {
                view: 'astor',
                id: this.name,
                root: this
            }
        }
    }

    get view(){
        return $$(this.name);
    }


    cleanSubscriptions() {
        if(this.subscriptionId)
            this.app.unregisterObservable(this.subscriptionId)
    }

    async initializeSubscription(admin){
        this.cleanSubscriptions();

        const subscriptions = await this.app.getContext(kContextTangoSubscriptions);
        this.subscriptionId = +new Date();

        this.app.registerObservable(this.subscriptionId, subscriptions.observe({
            host: this.tango_host.id,
            device: `tango/admin/${admin.name}`,
            attribute: "Servers",
            type: "change"
        }),kSubscriptionTopic,this.name)
    }


    run(){
        const tab = $$(this.name) || $$(this.app.getWidget(kMainWindow).mainView.addView(this.ui()))
        tab.show();
    }

    refreshHosts(){
        this.view.$$hosts.data.each(admin => {
            admin.promiseDevice.pipe(
                switchMap(device => device.newAttribute("HostState").read()),
                catchError(err => of(kUnknownTangoHostState)),
                map(v => v.value)
            ).subscribe(v => this.view.$$hosts.updateItem(admin.id, {state: v}))
        });
    }

    refreshServers(){
        if (!this.starter) return;
        this.starter.newAttribute("Servers").read().pipe(
            switchMap(resp => from(resp.value.map(el => el.split("\t"))))
        ).subscribe(updateServer.bind(this))
    }

    refreshDevices(){
        const server = this.view.$$servers.getSelectedItem();
        this.loadDevices(server)
    }

    refresh(){
        this.refreshHosts();

        this.refreshServers();

        this.refreshDevices();

        this.loadLog();
    }

    /**
     *
     * @param {TangoId} id
     */
    async setTangoHost(id){
        const rest = await this.app.getContext(kTangoRestContext);
        this.tango_host = rest.newTangoHost(id);
        this.loadHosts();
    }

    loadHosts(){
        this.view.$$hosts.showProgress();
        this.tango_host.toTangoRestApiRequest().get().toPromise()
            .then(() => {
                this.view.$$header.setValues(this.tango_host);
                this.view.$$servers.clearAll();
                this.view.$$hosts.clearAll();

                this.view.$$hosts.parse(
                    this.tango_host.database().pipe(
                        switchMap(db => db.deviceMemberList('tango/admin/*')),
                        mergeMap(resp => of(resp.output.map(name =>
                            new TangoAdmin(`${this.tango_host.id}/tango/admin/${name}`,name, this.tango_host.device(`tango/admin/${name}`))))),
                        catchError(err => {
                            this.dispatchError(err,kTopicLog,kChannelLog);
                            this.view.disable();
                            return of([]);
                        }),
                        tap(this.view.$$hosts.hideProgress())
                    ).toPromise()
                );
            });
    }

    /**
     *
     * @param  {TangoAdmin} admin
     * @return {Promise<void>}
     */
    async setStarter(admin){
        try {
            this.starter = await this.tango_host.device(`tango/admin/${admin.name}`).toPromise();
        } catch (e) {
            this.dispatchError(e, kTopicLog, kChannelLog);
            this.view.disable();
            return;
        }
        this.loadServers();
        this.loadLog();
        this.loadDevices();

        this.initializeSubscription(admin);
    }

    loadServers(){
        this.view.$$servers.showProgress();

        this.view.$$servers.clearAll();
        this.view.$$servers.parse(
            this.starter.newAttribute("Servers").read().pipe(
                map(resp => resp.value.map(el => el.split("\t"))),
                map(values => values.map(([name, state, controlled, level]) => new TangoServer( `${this.tango_host.id}/dserver/${name}`,name, state, level, this.tango_host.device(`dserver/${name}`)))),
                tap(this.view.$$servers.hideProgress())
            ).toPromise());
    }

    loadLog(){
        this.view.$$log.showProgress();
        this.view.$$log.clearAll();
        this.view.$$log.parse(
            this.starter.newCommand("DevReadLog").execute("Starter").pipe(
                map(resp => resp.output.split("\n").map(value => ({value}))),
                tap(this.view.$$log.hideProgress())
            ).toPromise());
    }

    /**
     * Clears devices list if server is undefined
     *
     * @param {TangoServer} server
     */
    loadDevices(server = undefined){
        this.view.$$devices.clearAll();
        if(!server) return;
        this.view.$$devices.showProgress();
        this.view.$$devices.config.server = server;


        this.view.$$devices.parse(
            server.device.pipe(
                switchMap(device => device.newCommand("QueryDevice").execute()),
                catchError(err => {
                    this.dispatchError(err, kTopicLog, kChannelLog);
                    return of([])
                }),
                mergeMap(resp => from(resp.output)),
                map(el => el.split("::")),
                map(([clazz, name]) => new TangoDevice(`${this.tango_host.id}/${name}`,clazz, name, server.name)),
                tap(this.view.$$devices.hideProgress()),
                toArray()
            ).toPromise());
    }
}
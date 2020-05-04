import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kTangoRestContext} from "controllers/tango_rest";
import newSearch from "views/search";
import "views/tango/devices_tree";
import "views/tango/tango_host_info_panel";
import {kControllerUserContext, kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicError, kTopicLog} from "controllers/log";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {kTangoDeviceWidget} from "widgets/tango/device";
import {newToolbarButton} from "views/helpers";
import {last, mergeMap} from "rxjs/operators";
import {of} from "rxjs";
import {kActionSelectTangoDevice, kActionSelectTangoHost, kAddTangoDevices} from "./actions";

export const kTangoTree = 'widget:tango_tree';

/**
 * @constant
 * @memberof ui.DevicesTree
 * @type {string}
 */
const kDevicesTreePanelHeaderIcon = "<span class='webix_icon mdi mdi-sitemap'></span>";
/**
 * @constant
 * @memberof ui.DevicesTree
 * @type {string}
 */
const kDevicesTreePanelHeader = `${kDevicesTreePanelHeaderIcon}Tango hosts tree`;

async function getTangoRest(app){
    const rest = await app.getContext(kTangoRestContext);
    return rest;
}

export default class TangoTree extends WaltzWidget {
    constructor() {
        super(kTangoTree);
    }

    config(){
        this.context = this.app.getController(kControllerUserContext);

        const proxy = {
            $proxy: true,
            load:() => {
                return this.context.get()
                    .then(userContext => userContext.getTangoHosts().map(host => ({id:host, value:host})));
            },
            save: (master, params, dataProcessor) => {
                let promiseContext = this.context.get();
                switch (params.operation) {
                    case "insert":
                        promiseContext = promiseContext
                            .then(userContext => userContext.tango_hosts[params.id] = null)
                        break;
                    case "delete":
                        promiseContext = promiseContext
                            .then(userContext => {
                                delete userContext.tango_hosts[params.id];
                            });
                        break;
                }

                return promiseContext
                    .then(() => this.context.save())
                    .then(() => this.refresh())
                    .then(() => this.dispatch(`Successfully ${params.operation}ed TangoHost[${params.id}]`,kTopicLog, kChannelLog));
            }
        }

        this.tango_hosts = new webix.DataCollection({
            url: proxy,
            save: proxy
        })

        this.listen(() => this.refresh(), kAddTangoDevices);

        this.listen(id => console.debug(`tango:tree select device ${id.getTangoDeviceId()}`), kActionSelectTangoDevice)
        this.listen(id => console.debug(`tango:tree select host ${id.getTangoHostId()}`), kActionSelectTangoHost)
    }

    ui(){
        const self = this;
        return {
            view:'accordionitem',
            header:kDevicesTreePanelHeader,
            headerHeight:0,
            headerAlt:kDevicesTreePanelHeader,
            headerAltHeight: 32,
            body: {
                width: 300,
                id: this.name,
                isolate: true,
                rows: [
                    newSearch("tree", "#value#"),
                    {
                        borderless:true,
                        root: this,
                        view: "devices_tree",
                        id: "tree"
                    },
                    {
                        hidden: true,
                        id:"wizard",
                        view:"wizard",
                        root: this
                    },
                    {
                        hidden: true,
                        view: "device_filters",
                        id:"devices_filter",
                        root: this
                    },
                    {
                        hidden: true,
                        view:"tango_hosts",
                        id: "tango_hosts",
                        root: this
                    },
                    {
                        hidden: true,
                        view: 'tango_host_info_panel',
                        id: 'tango_host_info',
                        root: this
                    },
                    {
                        borderless: true,
                        view: "toolbar",
                        cols:[
                            {
                                view: "icon",
                                icon:"mdi mdi-refresh",
                                click(){
                                    self.refresh();
                                }
                            },
                            {},
                            newToolbarButton('auto-fix',"wizard"),
                            newToolbarButton('filter',"devices_filter"),
                            newToolbarButton('information-variant',"tango_host_info"),
                            newToolbarButton("plus","tango_hosts")
                        ]
                    }
                ]
            }
        }
    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
    }

    get view(){
        return $$(this.name);
    }

    get tree(){
        return $$(this.name).$$("tree")
    }

    get tango_info(){
        return $$(this.name).$$("tango_host_info")
    }

    /**
     *
     * @param {TangoId} tangoHostId
     * @return {TangoHost}
     */
    selectHost(tangoHostId){
        this.dispatch(tangoHostId, kActionSelectTangoHost)
        getTangoRest(this.app)
            .then(rest => rest.newTangoHost(tangoHostId)
                .toTangoRestApiRequest()
                .get().toPromise())
            .then(host => this.tango_info.setValues(host))
    }

    async selectDatabase(tangoHostId){
        const rest = await getTangoRest(this.app);

        return rest.newTangoHost(tangoHostId).database()
            .toPromise()
            .then(db => this.selectDevice(db.id));
    }

    /**
     *
     * @param {TangoId} tangoDeviceId
     */
    selectDevice(tangoDeviceId){
        this.dispatch(tangoDeviceId, kActionSelectTangoDevice);
    }

    async selectDeviceByAlias(tangoHostId, alias){
        const rest = await getTangoRest(this.app);
        return rest.newTangoHost(tangoHostId).database()
            .toPromise()
            .then(db => db.aliasDevice(alias))
            .then(device => this.selectDevice(TangoId.fromDeviceId(`${tangoHostId.getTangoHostId()}/${device}`)));
    }

    async refresh(){
        this.tree.showProgress();
        const user = await this.app.getContext(kUserContext);
        const rest = await getTangoRest(this.app);
        this.tree.clearAll();


        rest.toTangoRestApiRequest().devices('tree')
            .get(`?${user.getTangoHosts().map(host => `host=${host}`).join('&')}&${user.device_filters.map(filter => `wildcard=${filter}`).join('&')}`)
            .subscribe({
                next: tree => {
                    this.tree.parse(tree)
                    this.tree.hideProgress();
                },
                error: err => this.dispatch(err, kTopicError, kChannelLog)
            })
    }

    async applyDeviceFilters(filters){
        const context = await this.context.get();
        context.device_filters = filters;

        this.context.save().then(() => this.refresh())
    }

    run(){
        this.render();

        this.refresh();
    }

    openDeviceControlPanel(){
        this.app.getWidget(kTangoDeviceWidget).open();
    }

    async addTangoHost(host){
        this.tango_hosts.add({id: host, value: host})
    }

    async removeTangoHost(host){
        this.tango_hosts.remove(host);
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
import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {newSearch} from "@waltz-controls/waltz-webix-extensions";
import "views/tango/devices_tree";
import "views/tango/tango_host_info_panel";
import {kUserContext} from "@waltz-controls/waltz-user-context-plugin";
import {kChannelLog, kTopicError, kTopicLog} from "controllers/log";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {kTangoDeviceWidget} from "widgets/tango/device";
import {newToolbarButton} from "views/helpers";
import {from} from "rxjs";
import {last, mergeMap} from "rxjs/operators";
import {kActionSelectTangoDevice, kActionSelectTangoHost, kAddTangoDevices} from "./actions";
import {kChannelTango, kTangoRestContext, TangoHost} from "@waltz-controls/waltz-tango-rest-plugin";
import {UpdateDeviceAlias} from "@waltz-controls/waltz-user-actions-plugin";

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

function updateHeader(host) {
    $$(kTangoTree).getParentView().config.headerAlt = webix.template(`<span class='webix_icon mdi mdi-${host.icon}'></span> ${host.id}`);

    $$(kTangoTree).getParentView().refresh();
}

export default class TangoTree extends WaltzWidget {
    constructor(app) {
        super(kTangoTree, app);

        const proxy = {
            $proxy: true,
            load:() => {
                return this.getUserContext()
                    .then(userContext => userContext.getTangoHosts().map(host => ({id:host, value:host})));
            },
            save: (master, params, dataProcessor) => {
                let promiseContext = this.getUserContext();
                switch (params.operation) {
                    case "insert":
                        promiseContext = promiseContext
                            .then(userContext => userContext.addTangoHost(params.id));
                        break;
                    case "delete":
                        promiseContext = promiseContext
                            .then(userContext => userContext.removeTangoHost(params.id));
                        break;
                }

                return promiseContext
                    .then(userContext => userContext.save())
                    .then(() => this.refresh())
                    .then(() => this.dispatch(`Successfully ${params.operation}ed TangoHost[${params.id}]`,kTopicLog, kChannelLog));
            }
        }

        this.tango_hosts = new webix.DataCollection({
            url: proxy,
            save: proxy
        })

        this.listen(() => this.refresh(), kAddTangoDevices);

        this.listen(() => this.refresh(),UpdateDeviceAlias.action,kChannelTango);

        this.listen(id => console.debug(`tango:tree select device ${id.getTangoDeviceId()}`), kActionSelectTangoDevice)
        this.listen(id => console.debug(`tango:tree select host ${id.getTangoHostId()}`), kActionSelectTangoHost)
    }

    getUserContext(){
        return this.app.getContext(kUserContext);
    }

    ui(){
        const self = this;
        return {
            view:'accordionitem',
            header:kDevicesTreePanelHeader,
            headerHeight:0,
            headerAlt:kDevicesTreePanelHeader,
            headerAltHeight: 32,
            collapsed: true,
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
            .then(host => new TangoHost(host))
            .then(host => {
                updateHeader(host);
                this.tango_info.setValues(host)
            })
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
        //TODO remember selected item
        this.tree.showProgress();
        const user = await this.app.getContext(kUserContext);
        const rest = await getTangoRest(this.app);
        this.tree.clearAll();


        rest.toTangoRestApiRequest().devices('tree')
            .get(`?${user.getTangoHosts().map(host => `host=${host}`).join('&')}&${user.device_filters.map(filter => `wildcard=${filter}`).join('&')}`)
            .subscribe({
                next: tree => {
                    this.tree.parse(tree);
                    //TODO restore selected item
                    this.tree.hideProgress();
                },
                error: err => this.dispatch(err, kTopicError, kChannelLog)
            })
    }

    async applyDeviceFilters(filters){
        const context = await this.getUserContext();
        context.device_filters = filters;

        this.getUserContext()
            .then(userContext => userContext.save())
            .then(() => this.refresh())
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

    async addTangoDevices({tango_host, server, className, devices}){
        const rest = await this.app.getContext(kTangoRestContext);

        const [host, port] = tango_host.split(':')

        const req = rest.newTangoHost({host, port}).database()
            .pipe(
                mergeMap(db => from(devices.map(name => db.addDevice([server,name,className])))),
                last()
            )

        this.dispatchObservable(req, kAddTangoDevices)
    }
}
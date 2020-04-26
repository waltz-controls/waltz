import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kTangoRestContext} from "controllers/tango_rest";
import newSearch from "views/search";
import "views/devices_tree";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicError} from "controllers/log";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {kTangoDeviceWidget} from "./device";
import {kAddTangoHost, kRemoveTangoHost} from "../settings";

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

export const kActionSelectTangoDevice = 'action:select_tango_device';
export const kActionSelectTangoHost = 'action:select_tango_host';

async function getTangoRest(app){
    const rest = await app.getContext(kTangoRestContext);
    return rest;
}

export default class TangoTree extends WaltzWidget {
    constructor() {
        super(kTangoTree);
    }

    config(){
        this.listen(() => this.refresh(), kAddTangoHost);

        this.listen(() => this.refresh(), kRemoveTangoHost);

        this.listen(id => console.log(id.getTangoDeviceId()), kActionSelectTangoDevice)
        this.listen(id => console.log(id.getTangoHostId()), kActionSelectTangoHost)
    }

    ui(){
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
                        template: "toolbar"
                    }
                ]
            }
        }
    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
    }

    get tree(){
        return $$(this.name).$$("tree")
    }

    /**
     *
     * @param {TangoId} tangoHostId
     * @return {TangoHost}
     */
    async selectHost(tangoHostId){
        this.dispatch(tangoHostId,kActionSelectTangoHost)
        const rest = await getTangoRest(this.app);
        return rest.newTangoHost(tangoHostId);
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
        const user = await this.app.getContext(kUserContext);
        const rest = await getTangoRest(this.app);
        this.tree.clearAll();


        rest.toTangoRestApiRequest().devices('tree')
            .get(`?${user.getTangoHosts().map(host => `host=${host}`).join('&')}&${user.device_filters.map(filter => `wildcard=${filter}`).join('&')}`)
            .subscribe({
                next: tree => this.tree.parse(tree),
                error: err => this.dispatch(err, kTopicError, kChannelLog)
            })
    }

    run(){
        this.render();

        this.refresh();
    }

    openDeviceControlPanel(){
        this.app.getWidget(kTangoDeviceWidget).open();
    }
}
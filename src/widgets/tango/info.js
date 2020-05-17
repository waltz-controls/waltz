import "views/tango/info_control_panel";

import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {
    kActionSelectTangoAttribute,
    kActionSelectTangoCommand,
    kActionSelectTangoDevice,
    kActionSelectTangoPipe
} from "./actions";
import {
    kTangoRestContext,
    TangoAttribute,
    TangoCommand,
    TangoDevice,
    TangoPipe
} from "@waltz-controls/waltz-tango-rest-plugin";

/**
 * @constant
 * @type {string}
 * @memberof ui.DeviceViewPanel
 */
const kInfoControlPanelHeaderIcon = "<span class='webix_icon mdi mdi-information-variant'></span>";
const kInfoControlPanelHeader = kInfoControlPanelHeaderIcon + " Info Control Panel";


const kWidgetTangoInfo = "widget:tango_info";
export default class TangoInfoPanelWidget extends WaltzWidget {
    constructor() {
        super(kWidgetTangoInfo);
    }

    config(){
        this.listen(id => this.setDevice(id),kActionSelectTangoDevice);
        this.listen(id => this.setAttribute(id),kActionSelectTangoAttribute);
        this.listen(id => this.setCommand(id),kActionSelectTangoCommand);
        this.listen(id => this.setPipe(id),kActionSelectTangoPipe);
    }

    ui(){
        return {
            view: 'accordionitem',
            id: 'info_control_panel_header',
            collapsed: true,
            header: kInfoControlPanelHeader,
            headerHeight:0,
            headerAlt:kInfoControlPanelHeader,
            headerAltHeight: 32,
            body: {
                root: this,
                view: 'info_control_panel',
                id: 'info_control_panel'
            }
        }
    }

    get view(){
        return $$('info_control_panel');
    }

    get header(){
        return $$('info_control_panel_header');
    }

    run(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
        this.view.getParentView().collapse();
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async setDevice(id){
        if(this.view.$$device.device && (this.view.$$device.device.id === id.getTangoDeviceId())) return;
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoDevice(id).toTangoRestApiRequest().get().toPromise()
            .then(device => new TangoDevice(device))
            .then(device => {
                this.view.updateHeader(device)
                this.view.$$device.setDevice(device)
                this.view.$$device.show();
            }
        )
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async setAttribute(id){
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoAttribute(id).toTangoRestApiRequest().get().toPromise()
            .then(attr => new TangoAttribute(attr))
            .then(attr => {
                    this.view.updateHeader(attr)
                    this.view.$$attribute.setAttribute(attr)
                    this.view.$$attribute.show();
                }
            )
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async setCommand(id){
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoCommand(id).toTangoRestApiRequest().get().toPromise()
            .then(cmd => new TangoCommand(cmd))
            .then(cmd => {
                    this.view.updateHeader(cmd)
                    this.view.$$command.setCommand(cmd)
                    this.view.$$command.show();
                }
            )
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async setPipe(id){
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoPipe(id).toTangoRestApiRequest().get().toPromise()
            .then(pipe => new TangoPipe(pipe))
            .then(pipe => {
                    this.view.updateHeader(pipe)
                    this.view.$$pipe.setPipe(pipe)
                    this.view.$$pipe.show();
                }
            )
    }
}
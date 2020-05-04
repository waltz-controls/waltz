import "views/tango/info_control_panel";

import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoDevice} from "./actions";
import {kTangoRestContext} from "controllers/tango_rest";
import {TangoDevice} from "models/tango";

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
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoDevice(id).info().toPromise().then(
            info => {
                this.view.device.setDevice(new TangoDevice({id:id.getTangoDeviceId(),host:id.getTangoHostId(), name: id.getTangoDeviceName(), info}))
                this.view.device.show();
            }
        )
    }
}
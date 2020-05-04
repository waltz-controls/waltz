import "views/tango/info_control_panel";

import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoHost} from "./actions";

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
        this.listen(id => this.setHost(id),kActionSelectTangoHost);
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
}
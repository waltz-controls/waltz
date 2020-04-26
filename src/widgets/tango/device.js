import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoDevice} from "widgets/tango/tree";

export const kTangoDeviceWidget = 'widget:tango_device';

export default class TangoDeviceWidget extends WaltzWidget {
    constructor() {
        super(kTangoDeviceWidget);
    }

    ui() {
        return {
            view: 'accordionitem',
            header: 'device',
            body: {
                id: this.name,
                isolate: true,
                template:'device'
            }
        }
    }

    get tab(){
        return $$(kTangoDeviceWidget).getParentView();
    }

    config(){
        this.listen(id => {
            //TODO
        },kActionSelectTangoDevice)
    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
        this.tab.collapse();
    }

    run(){
        this.render();
    }

    open(){
        this.tab.expand();
    }
}
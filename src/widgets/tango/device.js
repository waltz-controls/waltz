import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";

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
                template:'device'
            }
        }
    }

    config(){
        this.listen(id => {
            //TODO
        },'select_device','user')
    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
    }

    run(){
        this.render();
    }
}
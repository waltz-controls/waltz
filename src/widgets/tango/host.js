import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";

function header(host){
    return `<span class='webix_icon mdi mdi-database'></span><span class='webix_strong'>${host}</span>`;
}

export default class HostTabWidget extends WaltzWidget {
    constructor(host, app) {
        super(host, app);
    }

    ui(innerTab){
        return {
            header: header(this.name),
            close: true,
            body: {
                id: this.name,
                view: "tabview",
                tabbar: {
                    borderless:true,
                    popupWidth: 320,
                    tabMinWidth: 320,
                    root: this,
                    on: {
                        "onBeforeTabClose"() {
                            if (this.data.options.length === 1)
                                setTimeout(() => {
                                    this.config.root.app.getWidget(kMainWindow).mainView.removeView(
                                        this.config.root.name
                                    );
                                },0);

                        }
                    }
                },
                cells:[
                    innerTab
                ]
            }
        }
    }

    run(innerTab){
        return $$(this.name) || $$(this.app.getWidget(kMainWindow).mainView.addView(this.ui(innerTab)));
    }
}
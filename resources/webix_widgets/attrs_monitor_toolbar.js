/**
 * @function
 * @return {webix.config} toolbar
 * @memberof ui.AttrsMonitorView
 */
export default function newToolbar(extension = []){
    return {
        view: "toolbar",
        height: 40,
        cols: [
            // {
            //     view: "icon",
            //     id: "status",
            //     icon: "repeat",
            //     maxWidth: 20,
            //     align: "right"
            // },
            {
                view: "counter", id: "refresh", step: 10, value: 1000, min: 10, max: 100000, width: 90,
                tooltip: "Update refresh rate",
                on: {
                    onChange(){
                        this.getTopParentView()._delay = this.getValue();
                        if (this.getTopParentView().isRunning()) {
                            this.getTopParentView().stop();
                            this.getTopParentView().start();
                        }
                    },
                    onEnter(){
                        this.getTopParentView()._delay = this.getValue();
                        if (this.getTopParentView().isRunning()) {
                            this.getTopParentView().stop();
                            this.getTopParentView().start();
                        }
                    }
                }
            },
            {
                view: "button",
                type: "iconButton",
                icon: "refresh",
                align: 'right',
                width: 30,
                tooltip: "Update",
                click: function () {
                    this.getTopParentView().run();
                }
            },
            {
                view: "toggle",
                type: "iconButton",
                onIcon: "stop",
                offIcon: "play",
                maxWidth: 30,
                tooltip: "Update continuously",
                click: function () {
                    if (this.getValue()) {
                        // webix.html.removeCss( this.$$('status').getNode(), "fa-spin");
                        this.getTopParentView().stop();
                    } else {
                        // webix.html.addCss( this.$$('status').getNode(), "fa-spin");
                        this.getTopParentView().start();
                    }
                }
            },
            {}
        ].concat(extension)
    };
}
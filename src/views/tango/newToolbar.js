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
                view: "icon",
                icon: "wxi-sync",
                click: function () {
                    this.getTopParentView().run();
                }
            },
            {
                view: "icon",
                icon: "mdi mdi-play",
                value: false,
                click: function () {
                    if (this.config.value) {
                        this.config.value = false;
                        this.define("icon", "mdi mdi-play");
                        this.refresh();
                        // webix.html.removeCss( this.$$('status').getNode(), "fa-spin");
                        this.getTopParentView().stop();
                    } else {
                        this.config.value = true;
                        this.define("icon", "mdi mdi-pause");
                        this.refresh();
                        // webix.html.addCss( this.$$('status').getNode(), "fa-spin");
                        this.getTopParentView().start();
                    }
                }
            },{
                view: "counter", id: "refresh", step: 100, value: 1000, min: 10, max: 100000,
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
            {}
        ].concat(extension)
    };
}
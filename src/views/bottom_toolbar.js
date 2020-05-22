/**
 * Extends {@link https://docs.webix.com/api__refs__ui.toolbar.html webix.ui.toolbar}
 * @property {String} name
 * @memberof ui.Toolbar
 * @namespace bottom_toolbar
 */
import newLogger from "views/logger";

const bottom_toolbar = webix.protoUI(
    /** @lends bottom_toolbar.prototype */
    {
        name: "bottom_toolbar",
        /**
         * @memberof ui.Toolbar.bottom_toolbar
         */
        switchLogBtnIcon: function (type) {
            var $$btnLog = this.$$("btnLog");
            if (type === 'error') {
                $$btnLog.getNode().getElementsByTagName("button")[0].firstChild.style.color = "red";
            } else {
                $$btnLog.getNode().getElementsByTagName("button")[0].firstChild.style.color = "#606060";
            }
        },
        _log_popup: webix.ui({
            view: 'popup',
            id: 'log',
            minHeight: 320,
            height: 768,
            minWidth: 320,
            width: 480,
            body: {
                rows: [
                    newLogger('main-log')
                ]
            },
            on: {
                onHide: function () {
                    $$('bottom-toolbar').switchLogBtnIcon();
                }
            }
        }),
        defaults: {
            height: 32,
            cols: [
                {
                    borderless: true,
                    type: "header",
                    id: "rest-url",
                    template: "<span style='color: #606060;'>#msg# #type# #url#</span>",
                    data: {type: "", url: "", msg: ""}
                },
                //TODO rest api call result
                {
                    view: "icon",
                    id: "btnLog",
                    tooltip: "Log console",
                    //TODO add label
                    icon: "mdi mdi-information",
                    popup: 'log',
                    align: "right"
                }
            ]
        }
    },
    webix.IdSpace, webix.ui.toolbar);

/**
 * @memberof ui.Toolbar
 */
export default function newBottomToolbar(root) {
    return {
        root,
        id:'bottom-toolbar',
        view: "bottom_toolbar",
        maxHeight: 32
    };
}
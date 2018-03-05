/**
 *
 * @type {BottomToolbar}
 */
TangoWebapp.platform.BottomToolbar = MVC.Controller.extend("bottom_toolbar_controller", {
    getUI: function () {
        webix.protoUI({
                name: "bottom_toolbar",
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
                            {
                                view: 'logger',
                                id: 'main-log',
                                ejs: 'views/main_log_item.ejs'
                            }
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
                            template: "<span style='color: #606060;'>#msg#: #type# #url#</span>",
                            data: {type: "", url: "", msg: ""}
                        },
                        //TODO rest api call result
                        {
                            view: "button",
                            id: "btnLog",
                            type: "icon",
                            tooltip: "Log console",
                            //TODO add label
                            icon: "commenting",
                            width: 36,
                            popup: 'log',
                            align: "right"
                        },
                        {
                            type: "header",
                            width: 36,
                            tooltip: 'Report an issue...',
                            borderless: true,
                            template: "<a target='_blank' href='http://github.com/tango-controls/tango-webapp'><span class='webix_icon fa-github' style='color: #606060;'></span></a>"
                        }
                    ]
                }
            },
            webix.IdSpace, webix.ui.toolbar);

        return {
            view: "bottom_toolbar",
            id: "bottom-toolbar"
        };
    }
}, {
    "tango_webapp.rest_send subscribe": function (data) {
        //TODO bind rest-url to log data
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "PENDING"));
    },
    "tango_webapp.rest_failure subscribe": function (data) {
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "FAILED"));

        var id = $$('main-log').log({
            type: 'error',
            value: data.data.errors[0].description,
            timestamp: TangoWebapp.consts.LOG_DATE_FORMATTER(new Date())
        });
        $$('bottom-toolbar').switchLogBtnIcon('error');
    },
    "tango_webapp.rest_success subscribe": function (data) {
        $$('bottom-toolbar').$$('rest-url').parse(this._toMsg(data.data, "DONE"));
    },
    "platform.user_logout subscribe": function (event) {
        $$('main-log').clearAll();
    },
    _toMsg: function (req, msg) {
        return {
            type: req.type,
            url: req.url,
            msg: msg
        };
    }
});
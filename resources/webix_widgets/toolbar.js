/**
 * @module Toolbar
 *  @memberof ui
 */
(function () {
    var userMenu = webix.ui({
        view: "popup",
        id: "userMenu",
        width: 100,
        body: {
            view: "list",
            data: [
                {id: "userSettings", value: "Settings"},
                {id: "userSignOut", value: "Sign out", icon: "sign-out"}
            ],
            autoheight: true,
            borderless: true,
            on: {
                onItemClick: function (id) {
                    if (id === "userSettings") {
                        PlatformApi.PlatformUIController().openSettingsTab();
                    }
                    if (id === "userSignOut") {
                        OpenAjax.hub.publish('platform.user_logout', {});
                    }
                    $$("userMenu").hide();
                }
            }
        }
    });

    var toolsMenu = webix.ui({
        view: "popup",
        id: "toolsMenu",
        width: 100,
        body: {
            view: "list",
            data: [
                {id: "toolsScripting", value: "Scripting"},
                {id: "toolsAstor", value: "Astor"},
                {id: "toolsTerminal", value: "Terminal"}
            ],
            autoheight: true,
            borderless: true,
            on: {
                onItemClick: function (id) {
                    switch (id) {
                        case "toolsScripting":
                            PlatformApi.PlatformUIController().openScriptingTab();
                            break;
                        case "toolsAstor":
                            PlatformApi.PlatformUIController().openAstorTab();
                            break;
                        case "toolsTerminal":
                            PlatformApi.PlatformUIController().openTerminalTab();
                            break;
                        default:
                            webix.message("Submenu click: " + id);
                            break;
                    }
                    $$("toolsMenu").hide();
                }
            }
        }
    });

    var helpMenu = webix.ui({
        view: "popup",
        id: "helpMenu",
        width: 100,
        body: {
            view: "list",
            data: [
                {id: "helpAbout", value: "About"},
                {id: "helpDocs", value: "User docs"}
            ],
            autoheight: true,
            borderless: true,
            on: {
                onItemClick: function (id) {
                    if (id === "helpAbout") {
                        window.open("https://waltz-docs.readthedocs.io/en/latest/", "_blank");
                    }
                    if (id === "helpDocs") {
                        window.open("https://waltz-docs.readthedocs.io/en/latest/user_guide/", "_blank");
                    }
                    $$("helpMenu").hide();
                }
            }
        }
    });

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.toolbar.html webix.ui.toolbar}
     * @property {String} name
     * @memberof ui.Toolbar
     */
    var top_toolbar = webix.protoUI(
        /** @lends top_toolbar.prototype*/
        {
            name: 'top_toolbar',
            defaults: {
                height: 32,
                cols: [
                    {
                        type: "icon",
                        icon: "user",
                        id: "btnUsername",
                        view: 'button',
                        label: "#name#",
                        popup: "userMenu",
                        borderless: true,
                        width: 80,
                    },
                    {
                        type: "icon",
                        id: "btnTools",
                        view: 'button',
                        label: "Tools",
                        popup: "toolsMenu",
                        borderless: true,
                        width: 55
                    },
                    {
                        type: "icon",
                        id: "btnMenu",
                        view: 'button',
                        label: "Help",
                        popup: "helpMenu",
                        borderless: true,
                        width: 55
                    }
                ],
                on: {
                    "platform_api.ui.initialized subscribe": function (event) {
                        var context = event.data.context.UserContext;
                        this.$$("btnUsername").define('label', context.user);
                        this.$$("btnUsername").refresh();
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.toolbar);

    /**
     * @memberof ui.Toolbar
     */
    TangoWebapp.ui.newTopToolbar = function () {
        return {
            view: 'top_toolbar',
            id: 'top-toolbar'
        };
    };

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.toolbar.html webix.ui.toolbar}
     * @property {String} name
     * @memberof ui.Toolbar
     * @namespace bottom_toolbar
     */
    var bottom_toolbar = webix.protoUI(
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
                        TangoWebapp.ui.newLogger('main-log')
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
                        icon: "info-circle",
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
    /**
     * @memberof ui.Toolbar
     */
    TangoWebapp.ui.newBottomToolbar = function () {
        return {
            view: "bottom_toolbar",
            id: "bottom-toolbar"
        };
    }
})();
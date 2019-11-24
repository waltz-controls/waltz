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
                {id: "userSignOut", value: "Sign out", icon: "mdi mdi-logout"}
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
                {id: "toolsAstor", value: "Manager"},
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
        minWidth: 100,
        body: {
            view: "list",
            data: [
                {id: "helpAbout", value: "About"},
                {id: "helpDocs", value: "User docs"},
                {id: "reportIssue", value: "New issue", icon: "fas fa-github"}
            ],
            autoheight: true,
            borderless: true,
            on: {
                onItemClick: function (id) {
                    if (id === "helpAbout") {
                        window.open("https://www.waltz-controls.space/en/latest/", "_blank");
                    }
                    if (id === "helpDocs") {
                        window.open("https://www.waltz-controls.space/en/latest/user_guide/", "_blank");
                    }
                    if (id === "reportIssue") {
                        window.open("https://github.com/tango-controls/waltz/issues/new", "_blank");//TODO issue template ?template=issue.md; put issue.md into .github/ISSUE_TEMPLATE
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
                        view: "icon",
                        icon: "mdi mdi-account",
                        id: "btnUsername",
                        label: "#name#",
                        popup: "userMenu",
                        borderless: true
                    },
                    {
                        view: "icon",
                        id: "btnTools",
                        label: "Tools",
                        popup: "toolsMenu",
                        borderless: true
                    },
                    {
                        view: "icon",
                        id: "btnMenu",
                        label: "Help",
                        popup: "helpMenu",
                        borderless: true
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
    TangoWebapp.ui.newBottomToolbar = function () {
        return {
            view: "bottom_toolbar",
            id: "bottom-toolbar"
        };
    }
})();

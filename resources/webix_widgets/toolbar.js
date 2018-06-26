/**
 * @module Toolbar
 */
(function(){
    /**
     * @type {webix.protoUI}
     */
    var logger = webix.protoUI({
        _view: null,
        _limit: 125,
        _getUI: function () {
            var top = this;
            return {
                template: function (obj) {
                    return top._view.render(obj);
                }
            }
        },
        name: "logger",
        $init: function (config) {
            webix.extend(config, this._getUI());
            this._view = new View({url: this.defaults.ejs});
        },
        log: function (item) {
            if (item.type === 'error') item.$css = {"background-color": "lightcoral"};
            item.adjusted = true;
            var id = this.add(item);
            this.moveTop(id);
            while (this.data.count() > this._limit) {
                this.remove(this.getLastId());
            }
        },
        defaults: {
            type: {
                height: Infinity
            },
            ejs: 'views/main_log_item.ejs'
        }
    }, webix.IdSpace, webix.ui.list);

    /**
     * @type {webix.protoUI}
     */
    var top_toolbar = webix.protoUI({
        name: 'top_toolbar',
        defaults: {
            height: 32,
            cols: [
                {
                    view: "template",
                    type: "header",
                    borderless: true,
                    width: 100,
                    template: "<a target='_blank' href='http://tango-controls.org'><span style='width: 240px'><img alt='Tango-Controls' style='max-width: 100%; max-height: 100%' src='../../images/platform/logo_tangocontrols.png'></span></a>"
                },
                {
                    view: "template",
                    type: "header",
                    borderless: true,
                    width: 100,
                    template: "<a target='_blank' href='http://www.hzg.de'><span style='width: 240px'><img alt='Helmholtz-Zentrum Geesthacht' style='max-width: 100%; max-height: 100%' src='../../images/platform/hzg_rgb_mitzusatz_in_e_300dpi.png'></span></a>"
                },
                {
                    view: "template",
                    type: "header",
                    borderless: true,
                    template: "<a target='_blank' href='http://www.ingvord.ru'><span style='width: 40px'><img alt='IK company' style='max-width: 100%; max-height: 100%' src='../../images/platform/logo_ik.png'></span></a>"
                },
                {
                    // gravity: 4
                },
                {
                    align: 'right',
                    cols: [
                        {
                            type: 'icon',
                            id: "btnUsername",
                            view: 'button',
                            label: "#name#",
                            tooltip: "#name#",
                            icon: "user",
                            align: "right",
                            width: 100,
                            click:function(){
                                if($$('settings')){
                                    $$('settings').show();
                                }
                            }
                        },
                        {
                            view: "button",
                            id: "btnUser",
                            type: "icon",
                            tooltip: "Sign out...",
                            icon: "sign-out",
                            width: 36,
                            click: function () {
                                OpenAjax.hub.publish('platform.user_logout', {});
                            },
                            align: "right"
                        }
                    ]
                }
            ]
        }
    }, webix.IdSpace, webix.ui.toolbar);

    TangoWebapp.ui.newTopToolbar = function(){
        return {
            view: 'top_toolbar',
            id: 'top-toolbar'
        };
    };

    /**
     * @type {webix.protoUI}
     */
    var bottom_toolbar = webix.protoUI({
            name: "bottom_toolbar",
            switchLogBtnIcon: function (type) {
                var $$btnLog = this.$$("btnLog");
                if (type === 'error') {
                    $$btnLog.getNode().getElementsByTagName("button")[0].firstChild.style.color = "red";
                } else {
                    $$btnLog.getNode().getElementsByTagName("button")[0].firstChild.style.color = "#606060";
                }
            },
            _user_log_popup:webix.ui({
                view: 'popup',
                id: 'user-log-popup',
                minHeight: 320,
                height: 768,
                minWidth: 320,
                width: 1024,
                body: {
                    rows: [
                        {
                            view: 'logger',
                            id: 'user-log'
                        }
                    ]
                }
            }),
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
                            id: 'main-log'
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
                        id: "btnUserLog",
                        type: "icon",
                        tooltip: "User actions log",
                        //TODO add label
                        icon: "commenting",
                        width: 36,
                        popup: 'user-log-popup',
                        align: "right"
                    },
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

    TangoWebapp.ui.newBottomToolbar = function(){
        return {
            view: "bottom_toolbar",
            id: "bottom-toolbar"
        };
    }
})();
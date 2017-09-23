webix.protoUI({
    name: "Main",
    defaults: {
        type: "space",
        rows: [
            TangoWebapp.ui.newMainToolbar(),
            {
                cols: [
                    TangoWebapp.ui.newDeviceTree(),
                    {view: "resizer"},
                    {type: "space", width: 10},
                    {view: "resizer"},
                    {
                        view: "tabview",
                        id: "main-tabview",
                        cells: [
                            {
                                header: "Start page",
                                body: {
                                    view: "layout",
                                    padding: 10,
                                    // css: {"background-color": "rgb(255, 255, 255)"},
                                    rows: [
                                        {
                                            //css: {"text-align" : "center", "background-image": "linear-gradient(rgb(229, 241, 255), rgb(255, 255, 255))"},
                                            template: new View({url: 'views/start_page.ejs'}).render()
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                view: "toolbar",
                height: 32,
                cols: [
                    {},
                    {
                        view: "button",
                        id: "btnHelp",
                        type: "icon",
                        tooltip: "Info",
                        icon: "question",
                        width: 36,
                        click: top.help,
                        align: "right"
                    },
                    {
                        view: "button",
                        id: "btnLog",
                        type: "icon",
                        tooltip: "Log console",
                        icon: "eye",
                        width: 36,
                        popup: 'log',
                        align: "right"
                    }
                ],
                help: function () {
                    var top = this.getTopParentView();
                    top._help_popup.show();
                },
                switchLogBtnIcon: function (type) {
                    var $$btnLog = this.$$("btnLog");
                    if (type === 'error') {
                        $$btnLog.config.icon = "bolt";
                        $$btnLog.refresh();
                        $$btnLog.$view.getElementsByTagName("button")[0].style.background = 'lightcoral';
                    } else {
                        $$btnLog.config.icon = "eye";
                        $$btnLog.refresh();
                        $$btnLog.$view.getElementsByTagName("button")[0].style.background = '';
                    }
                },
                _log_popup: webix.ui({
                    view: 'popup',
                    id: 'log',
                    minHeight: 320,
                    height: 640,
                    minWidth: 320,
                    width: 480,
                    body: {
                        rows: [
                            {
                                view: 'Logger',
                                id: 'main-log',
                                ejs: 'views/main_log_item.ejs'
                            }
                        ]
                    },
                    on: {
                        onHide: function () {
                            $$('main-toolbar').switchLogBtnIcon('');
                        }
                    }
                }),
                _help_popup: webix.ui({
                    view: "popup",
                    zIndex: 1,
                    toFront: true,
                    position: "center",
                    autoheight: true,
                    minHeight: 480,
                    minWidth: 320,
                    body: {
                        rows: [
                            {
                                margin: 5,
                                template: new View({url: "views/help.ejs"}).render()
                            }
                        ]
                    }
                })
            }
        ]
    }
}, webix.ui.layout);
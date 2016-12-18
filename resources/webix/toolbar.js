webix.protoUI({
    name: "textarea0",
    $cssName: "textarea",
    getValue: function () {
        var rv = webix.ui.textarea.prototype.getValue.call(this);
        return rv.split('\n');
    },
    setValue: function (value) {
        webix.ui.textarea.prototype.setValue.call(this, value.join('\n'));
    }
}, webix.ui.textarea);

webix.protoUI({
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
    }),
    _wizard_window: webix.ui({
        view: "window",
        zIndex: 1,
        toFront: true,
        position: "center",
        autofocus: true,
        autoheight: true,
        minwidth: 320,
        close: true,
        move: true,
        headHeight: 20,
        head: {template: "New server wizard"},
        body: {
            rows: [
                {
                    view: "form",
                    id: "frmServerWizard",
                    elements: [
                        {
                            view: "text",
                            name: "server",
                            label: "ServerName/Instance:",
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "server/instance, i.e. TangoTest/test",
                            validate: function (value) {
                                return /^[\w]*\/[\w]*$/.test(value);
                            }, invalidMessage: "Incorrect server/instance"
                        },
                        {
                            view: "text",
                            name: "className",
                            label: "Class name:",
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "MyClass",
                            validate: webix.rules.isNotEmpty,
                            invalidMessage: "Can not be empty"
                        },
                        {
                            view: "textarea0",
                            name: "devices",
                            label: "Devices:",
                            height: 200,
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "instance/family/member, i.e. sys/tg_test/1",
                            validate: function (value) {
                                var rv = false;
                                do {
                                    rv = /[\w]*\/[\w]*\/[\w]*/.test(value.shift());
                                } while (rv && value.length != 0);
                                return rv;
                            }, invalidMessage: "Incorrect devices"
                        }
                    ]
                },
                {
                    view: "toolbar", cols: [
                    {},
                    {
                        view: "button", value: "Apply", width: 100, align: "center", click: function () {
                        var $$serverWizard = $$('frmServerWizard');
                        if ($$serverWizard.validate()) {
                            TangoWebapp.helpers.serverWizard($$serverWizard.getValues());
                            this.getTopParentView().hide();
                        }
                    }
                    },
                    {
                        view: "button", value: "Close", width: 100, align: "right", click: function () {
                        this.getTopParentView().hide()
                    }
                    }]
                }
            ]
        }
    }),
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
    addTangoHost: function(){
        var top = this.getTopParentView();

        var tango_host = top.$$('txtTangoHost').getValue();
        //TODO validate
        TangoWebapp.globals.tango_host = new TangoHost({host: tango_host.split(':')[0], port: parseInt(tango_host.split(':')[1])});
        //TODO add to rest_api
    },
    refresh: function () {
        var top = this.getTopParentView();

        TangoWebapp.consts.REST_API_URL = top.$$('txtTangoRestApiUrl').getValue();
        TangoWebapp.consts.TANGO_HOST = top.$$('txtTangoHost').getValue();

        var dbExists = false;
        TangoWebapp.helpers.iterate(TangoWebapp.databases, function (id, db) {
            dbExists |= db.url === TangoWebapp.consts.REST_API_URL;
        });

        if (!dbExists) {
            TangoWebapp.helpers.createDatabase();
        }

        $$('device_tree').updateRoot();
    },
    wizard: function () {
        var top = this.getTopParentView();

        top._wizard_window.show();
    },
    help: function () {
        var top = this.getTopParentView();
        top._help_popup.show();
    },
    _getUI: function () {
        var top = this;
        var versionLabel = "app.ver.: " + TangoWebapp.version + " / rest ver.: " + TangoWebapp.consts.REST_API_VERSION;
        return {
            cols: [
                {
                    view: "text",
                    id: "txtTangoRestApiUrl",
                    value: TangoWebapp.consts.REST_API_URL,
                    label: "TANGO_REST_URL:",
                    labelWidth: 150
                },
                {
                    view: "text",
                    id: "txtTangoHost",
                    value: TangoWebapp.globals.tango_host.toString(),
                    label: "TANGO_HOST:",
                    labelWidth: 150
                },
                {view: "button", id: "btnAdd", type: "iconButton", icon: "plus", width: 36, click: top.addTangoHost},
                {view: "button", id: "btnRefresh", type: "iconButton", icon: "refresh", width: 36, click: top.refresh},
                {
                    view: "button",
                    id: "btnAddWizard",
                    label: "Add server wizard",
                    type: "iconButton",
                    icon: "magic",
                    width: 180,
                    click: top.wizard
                },
                {},
                {view: "label", label: versionLabel, align: "right", width: 260},
                {
                    view: "button",
                    id: "btnHelp",
                    type: "iconButton",
                    icon: "question",
                    width: 36,
                    click: top.help,
                    align: "right"
                },
                {
                    view: "button",
                    id: "btnLog",
                    type: "iconButton",
                    icon: "eye",
                    width: 36,
                    popup: 'log',
                    align: "right"
                }
            ]
        }
    },
    changeTangoHost: function () {
        TangoWebapp.helpers.changeTangoHost();
    },
    name: "MainToolbar",
    $init: function (config) {
        webix.extend(config, this._getUI());
    },
    defaults: {
        height: 40
    }
}, webix.IdSpace, webix.EventSystem, webix.ui.toolbar);


TangoWebapp.ui.newMainToolbar = function () {
    return {
        view: "MainToolbar",
        id: "main-toolbar"
    }
};
import {get_device_info} from "./device_info_panel.js";

const as_array = true;

class TangoServer {
    constructor(name, state, level, device) {
        this.id = name;
        this.name = name;
        this._level = level;
        this._state = state;
        this.device = device;
    }

    get level() {
        return this._level === "0" ? "Not controlled" : this._level;
    }

    get state() {
        switch (this._state) {
            case "MOVING":
                return "STARTING/STOPPING";
            case "FAULT":
                return "NOT RUNNING/UNKNOWN";
            default:
                return "RUNNING";
        }
    }
}

class TangoDevice {
    constructor(clazz, name, server) {
        this.clazz = clazz;
        this.name = name;
        this.server = server;
    }
}

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/28/19
 */
const astor = webix.protoUI({
    name: 'astor',
    tango_host: null,
    starter: null,
    cleanSubscriptions() {
        PlatformContext.subscription.removeEventListener({
            host: this.tango_host.id,
            device: `tango/admin/${this.tango_host.host}`,
            attribute: "Servers",
            type: "change"
        });
    },
    async _update_log() {
        this.$$('log').clearAll();
        this.$$('log').parse(
            (await this.starter.fetchCommand("DevReadLog")).execute("Starter")
                .then(resp => resp.output.split("\n").map(value => ({value}))
                ));
    },
    async initialize() {
        this.enable();
        this.$$('header').setValues(this.tango_host);
        if (this.tango_host && this.starter) this.cleanSubscriptions();
        try {
            this.starter = await this.tango_host.fetchDevice(`tango/admin/${this.tango_host.host}`);
        } catch (e) {
            //TODO show overlay - starter is not defined
            TangoWebappHelpers.error("Starter is not installed or host name does not match!", e);
            this.disable();
            return;
        }

        this.$$('servers').clearAll();
        this.$$('servers').parse(
            (await this.starter.fetchAttr("Servers")).read()
                .then(v => v.value.map(el => el.split("\t")))
                .then(values => values.map(([name, state, controlled, level]) => new TangoServer(name, state, level, this.tango_host.fetchDevice(`dserver/${name}`)))));

        this._update_log();

        PlatformContext.subscription.addEventListener({
                host: this.tango_host.id,
                device: `tango/admin/${this.tango_host.host}`,
                attribute: "Servers",
                type: "change"
            },
            function (event) {
                this._update_servers(event.data.map(el => el.split("\t")));
                this._update_log();
            }.bind(this),
            function (error) {
                TangoWebappHelpers.error(error);
            }.bind(this));
    },
    _update_servers(values) {
        const servers = values.map(([name, state, controlled, level]) => new TangoServer(name, state, level, this.tango_host.fetchDevice(`dserver/${name}`)));
        servers.forEach(server => this.$$('servers').updateItem(server.id, server));
    },
    async run() {
        if (this.starter != null) {
            (await this.starter.fetchAttr("Servers")).read()
                .then(v => this._update_servers(v.value.map(el => el.split("\t"))));
            this._update_log();
        }
    },
    _execute_for_all(cmdName) {
        webix.promise.all(
            this.$$('servers').getSelectedItem(as_array)
                .map(async server => {
                    const cmd = await this.starter.fetchCommand(cmdName);
                    UserAction.executeCommand(cmd, server.name);
                })).then(() => this.run());
    },
    devKill() {
        this._execute_for_all("HardKillServer");
    },
    devStop() {
        this._execute_for_all("DevStop");
    },
    devStart() {
        this._execute_for_all("DevStart");
    },
    devAdd(newDev) {
        const $$devices = this.$$('devices');
        const server = $$devices.config.server;
        const clazz = $$devices.getItem($$devices.getFirstId()).clazz;//TODO drop down list for multiple class servers
        if (server != null)
            this.tango_host.fetchDatabase().then(db => {
                db.addDevice([server.name, newDev, clazz])
            })
    },
    devRestart() {
        const $$devices = this.$$('devices');
        $$devices.getSelectedItem(as_array)
            .forEach(async dev => {
                const cmd = await (await $$devices.config.server.device).fetchCommand("DevRestart");
                UserAction.executeCommand(cmd, dev.name);
            });
    },
    devRemove() {
        this.$$('devices').getSelectedItem(as_array)
            .forEach(async dev => {
                this.tango_host.fetchDevice(dev.name)
                    .then(function (device) {
                        OpenAjax.hub.publish("tango_webapp.device_delete", {
                            data: {
                                device: device
                            }
                        });
                    })
                    .then(() => {
                        this.$$('devices').remove(dev.id);
                    })
                    .fail(TangoWebappHelpers.error)
            });
    },
    _ui() {
        return {
            rows: [
                {
                    id: "header",
                    template: "<span class='webix_icon fa-database'></span> #id#",
                    type: "header"
                },
                {
                    cols: [
                        {
                            rows: [
                                {
                                    view: "unitlist",
                                    id: "servers",
                                    select: true,
                                    multiselect: true,
                                    uniteBy(obj) {
                                        return obj.level;
                                    },
                                    template: "<span class='webix_icon fa-server'></span>#name# [#state#]",
                                    on: {
                                        onAfterSelect(id) {
                                            const server = this.getItem(id);
                                            const $$devices = this.getTopParentView().$$('devices');
                                            $$devices.config.server = server;
                                            server.device
                                                .then(device => {
                                                    PlatformContext.devices.setCursor(device.id);
                                                    return device;
                                                })
                                                .then(device => {
                                                    return device.executeCommand("QueryDevice");
                                                })
                                                .then(resp => {
                                                    $$devices.clearAll();
                                                    $$devices.parse(resp.output.map(el => new TangoDevice(el.split("::")[0], el.split("::")[1], server.name)));
                                                })
                                                .fail(() => {
                                                    $$devices.clearAll();
                                                })
                                        }
                                    }
                                },
                                {
                                    view: "toolbar",
                                    cols: [
                                        {
                                            view: "button",
                                            value: "Kill",
                                            tooltip: "Kills selected servers",
                                            type: "danger",
                                            click() {
                                                this.getTopParentView().devKill();
                                            }
                                        },
                                        {
                                            view: "button",
                                            value: "Stop",
                                            tooltip: "Stops selected servers",
                                            click() {
                                                this.getTopParentView().devStop();
                                            }
                                        },
                                        {
                                            view: "button",
                                            value: "Start",
                                            tooltip: "Starts selected servers",
                                            click() {
                                                this.getTopParentView().devStart();
                                            }
                                        },
                                        {
                                            gravity: 2
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "refresh",
                                            tooltip: "Refresh servers list",
                                            width: 30,
                                            click() {
                                                this.getTopParentView().run();
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            rows: [
                                {
                                    view: "list",
                                    id: "devices",
                                    server: null,
                                    select: true,
                                    multiselect: true,
                                    template: "<span class='webix_icon fa-microchip'></span>#name#",
                                    on: {
                                        onAfterSelect(id) {
                                            const device = this.getItem(id);
                                            this.getTopParentView().tango_host.fetchDevice(device.name)
                                                .then(device => PlatformContext.devices.setCursor(device.id));
                                        }
                                    }
                                },
                                {
                                    view: "form",
                                    cols: [
                                        {
                                            view: "text",
                                            name: "devNewName",
                                            placeholder: "domain/family/member",
                                            validate: webix.rules.isNotEmpty
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "plus",
                                            width: 30,
                                            click() {
                                                const form = this.getFormView();
                                                if (form.validate())
                                                    this.getTopParentView().devAdd(form.elements.devNewName.getValue());
                                            }
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "repeat",
                                            tooltip: "Restart selected device(s)",
                                            width: 30,
                                            click() {
                                                this.getTopParentView().devRestart();
                                            }
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "trash",
                                            tooltip: "Delete selected device(s)",
                                            width: 30,
                                            click() {
                                                this.getTopParentView().devRemove();
                                            }
                                        }
                                    ]
                                },
                                {
                                    template: "Device info:",
                                    type: "header"
                                },
                                {
                                    id: 'info',
                                    view: 'datatable',
                                    header: false,
                                    autoheight: true,
                                    columns: [
                                        {id: 'info'},
                                        {id: 'value', editor: "text", fillspace: true}
                                    ],
                                    on: {
                                        onBindApply: function (device) {
                                            if (!device || device.id === undefined) return false;

                                            var info = get_device_info(device);
                                            info.push({
                                                id: 'alias',
                                                info: 'Alias',
                                                value: device.alias
                                            });

                                            this.clearAll();
                                            this.parse(info);
                                        }
                                    }
                                },
                                {
                                    template: "Log:",
                                    type: "header"
                                },
                                {
                                    view: "list",
                                    id: "log"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());

        this.$ready.push(() => {
            this.$$('info').bind(config.context.devices);
            //TODO bind devices to servers
        });
    },
    defaults: {
        on: {
            "tango_webapp.item_selected subscribe": function (event) {
                if (event.data.kind !== "tango_host" || (this.tango_host && this.tango_host.id === event.data.id)) return;
                this.tango_host = TangoHost.find_one(event.data.id);
                this.initialize();
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);


TangoWebapp.ui.newAstorTab = function (context) {
    return {
        header: "<span class='webix_icon fa-tasks'></span> Manager",
        close: true,
        borderless: true,
        body: {
            view: 'astor',
            id: 'astor',
            context
        }
    }
};


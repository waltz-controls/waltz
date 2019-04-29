import {get_device_info} from "./device_info_panel.js";

class TangoServer {
    constructor(name, state, level, device) {
        this.name = name;
        this.level = level;
        this.state = state;
        this.device = device;
    }
}

class TangoDevice {
    constructor(clazz, name) {
        this.clazz = clazz;
        this.name = name;
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
    async initialize() {
        this.$$('header').setValues(this.tango_host);
        this.starter = await this.tango_host.fetchDevice(`tango/admin/${this.tango_host.host}`);

        this.$$('servers').clearAll();
        this.$$('servers').parse(
            (await this.starter.fetchAttr("Servers")).read()
                .then(v => v.value.map(el => el.split("\t")))
                .then(values => values.map(([name, state, controlled, level]) => new TangoServer(name, state, level, this.tango_host.fetchDevice(`dserver/${name}`)))));

        debugger
    },
    kill() {

    },
    stop() {

    },
    start() {

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
                                    template: "<span class='webix_icon fa-server'></span>#name# #state#",
                                    on: {
                                        onAfterSelect(id) {
                                            const server = this.getItem(id);
                                            server.device
                                                .then(device => {
                                                    PlatformContext.devices.setCursor(device.id);
                                                    return device;
                                                })
                                                .then(device => {
                                                    return device.executeCommand("QueryDevice");
                                                })
                                                .then(resp => {
                                                    const $$devices = this.getTopParentView().$$('devices');
                                                    $$devices.clearAll();
                                                    $$devices.parse(resp.output.map(el => new TangoDevice(el.split("::")[0], el.split("::")[1])));
                                                })
                                                .fail(() => {
                                                    const $$devices = this.getTopParentView().$$('devices');
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
                                                this.getTopParentView().kill();
                                            }
                                        },
                                        {
                                            view: "button",
                                            value: "Stop",
                                            tooltip: "Stops selected servers",
                                            click() {
                                                this.getTopParentView().stop();
                                            }
                                        },
                                        {
                                            view: "button",
                                            value: "Start",
                                            tooltip: "Starts selected servers",
                                            click() {
                                                this.getTopParentView().start();
                                            }
                                        },
                                        {
                                            gravity: 2
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
                                    select: true,
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
                                        {},
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "plus",
                                            width: 30,
                                            click() {
                                                this.getTopParentView().addDevice();
                                            }
                                        },
                                        {
                                            view: "button",
                                            type: "icon",
                                            icon: "trash",
                                            width: 30,
                                            click() {
                                                this.getTopParentView().removeDevice();
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
                                    template: "Server's log:",
                                    type: "header"
                                },
                                {
                                    template: "server log"
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
        })
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
        header: "<span class='webix_icon fa-tasks'></span> Astor",
        close: true,
        borderless: true,
        body: {
            view: 'astor',
            id: 'astor',
            context
        }
    }
};


import newToolbar from "./newToolbar";
import {Runnable, WaltzWidgetMixin} from "views/mixins";
import {kActionSelectTangoDevice} from "widgets/tango/actions";
import {TangoId} from "@waltz-controls/tango-rest-client";

const kDBHeader = "<span class='webix_icon mdi mdi-database'></span> #id#";




const hosts = {
    view: "list",
    id: "hosts",
    select: true,
    autoheight:true,
    template: "<span class='webix_list_icon mdi mdi-monitor' style='color: {common.highlightColor()}'></span><span" +
        " style='color: {common.highlightColor()}'> #name#</span>",
    type: {
        highlightColor(obj){
            console.debug(`host state = ${obj.state}`);
            switch (obj.state) {
                case 6://MOVING
                    return "blue";
                case 11://ALARM
                    return "orangered";
                case 8://FAULT
                    return "red";
                case 0://ON
                    return "green";
                case -1://UNKNOWN
                default:
                    return "gray";
            }
        }
    },
    on: {
        onAfterSelect(id) {
            const admin = this.getItem(id);


            this.getTopParentView().config.root.setStarter(admin);
        },
        onAfterLoad(){
            this.getTopParentView().config.root.refreshHosts();

            this.select(this.getFirstId());
        }
    },
    click(id){
        this.getTopParentView().config.root.dispatch(TangoId.fromDeviceId(id), kActionSelectTangoDevice);
    }
};

const servers = {
    view: "unitlist",
    id: "servers",
    select: true,
    multiselect: true,
    uniteBy(obj) {
        return obj.level;
    },
    template: "<span class='webix_list_icon mdi mdi-server' style='color: {common.highlightColor()}'></span><span" +
        " style='color: {common.highlightColor()}'> #name#</span>",
    type: {
        highlightColor(obj){
            switch (obj._state) {
                case "MOVING":
                    return "blue";
                case "FAULT":
                    return "red";
                case "ON":
                    return "green";
                default:
                    return "gray";
            }
        }
    },
    on: {
        onItemClick(id){
            if(this.getSelectedId() === id){
                this.unselectAll();
            } else {
                this.select(id);
            }
            return false;
        },
        onAfterSelect(id) {
            const server = this.getItem(id);
            this.getTopParentView().config.root.loadDevices(server);
        }
    },
    click(id){
        this.getTopParentView().config.root.dispatch(TangoId.fromDeviceId(id), kActionSelectTangoDevice);
    }
};

const devices = {
    view: "list",
    id: "devices",
    server: null,
    select: true,
    multiselect: true,
    template: "<span class='webix_list_icon mdi mdi-developer-board'></span> #name#",
    click(id){
        this.getTopParentView().config.root.dispatch(TangoId.fromDeviceId(id), kActionSelectTangoDevice);
    }
};

function _ui(){
    return {
        rows: [
            {
                id: "header",
                template: kDBHeader,
                type: "header"
            },
            {
                cols: [
                    {
                        rows: [
                            {
                                ...hosts
                            },
                            {
                                template: "Tango Servers:",
                                type: "header"
                            },
                            {
                                ...servers
                            },
                            {
                                view: "toolbar",
                                cols: [
                                    {
                                        view: "button",
                                        value: "Kill",
                                        tooltip: "Kills selected servers",
                                        css:"webix_danger",
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
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        rows: [
                            {
                                template: "Tango Devices:",
                                type: "header"
                            },
                            {
                                view: "form",
                                id: "frmNewDevice",
                                cols: [
                                    {
                                        view: "text",
                                        name: "name",
                                        placeholder: "domain/family/member",
                                        validate: webix.rules.isNotEmpty,
                                        gravity: 2
                                    },
                                    {
                                        view: "text",
                                        name: "clazz",
                                        placeholder: "Tango class",
                                        validate: webix.rules.isNotEmpty
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-plus",
                                        width: 30,
                                        click() {
                                            const form = this.getFormView();
                                            if (form.validate())
                                                this.getTopParentView().devAdd(
                                                    form.elements.name.getValue(),
                                                    form.elements.clazz.getValue());
                                        }
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-sync",
                                        tooltip: "Restart selected device(s)",
                                        width: 30,
                                        click() {
                                            this.getTopParentView().devRestart();
                                        }
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-trash",
                                        tooltip: "Delete selected device(s)",
                                        width: 30,
                                        click() {
                                            this.getTopParentView().devRemove();
                                        }
                                    }
                                ]
                            },
                            {
                                ...devices
                            },
                            {
                                template: "Manager's Log:",
                                type: "header"
                            },
                            {
                                view: "list",
                                id: "log"
                            }
                        ]
                    }
                ]
            },
            newToolbar()
        ]
    }
}

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/28/19
 */
const astor = webix.protoUI({
    name: 'astor',
    get $$header(){
        return this.$$('header');
    },

    get $$hosts(){
        return this.$$('hosts');
    },

    get $$servers(){
        return this.$$('servers');
    },

    get $$devices(){
        return this.$$('devices')
    },

    get $$log(){
        return this.$$('log')
    },

    run() {
        this.config.root.refresh();
    },
    _execute_for_all(cmdName) {
        webix.promise.all(
            this.$$('servers').getSelectedItem(as_array)
                .map(async server => {
                    const cmd = await this.starter.fetchCommand(cmdName);
                    new ExecuteTangoCommand({user: PlatformContext.UserContext.user, command: cmd, value: server.name}).submit();
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
    devAdd(name, clazz) {
        const $$devices = this.$$('devices');
        const server = $$devices.config.server;
        if (server != null)
            OpenAjax.hub.publish("tango_webapp.device_add", {
                data: {
                    device: {
                        server: server.name,
                        name,
                        clazz
                    },
                    host: this.tango_host
                }
            });
    },
    devRestart() {
        const $$devices = this.$$('devices');
        $$devices.getSelectedItem(as_array)
            .forEach(async dev => {
                const cmd = await (await $$devices.config.server.device).fetchCommand("DevRestart");
                new ExecuteTangoCommand({user: PlatformContext.UserContext.user, command: cmd, value: dev.name}).submit();
            });
    },
    devRemove() {
        this.$$('devices').getSelectedItem(as_array)
            .forEach(async dev => {
                const db = await this.tango_host.fetchDatabase();
                db.deleteDevice(dev.name).then(function () {
                    OpenAjax.hub.publish("tango_webapp.device_delete", {
                        data: {
                            device: dev
                        }
                    });
                })
                    .then(() => {
                        this.$$('devices').remove(dev.id);
                    })
                    .fail(TangoWebappHelpers.error)
            });
    },
    $init(config) {
        webix.extend(config, _ui());

        this.$ready.push(() => {
            webix.extend(this.$$("hosts"), webix.ProgressBar);
            webix.extend(this.$$("servers"), webix.ProgressBar);
            webix.extend(this.$$("devices"), webix.ProgressBar);
            webix.extend(this.$$("log"), webix.ProgressBar);

            this.$$('frmNewDevice').bind(this.$$("devices"));
            //TODO bind devices to servers
        });
    }
}, WaltzWidgetMixin, Runnable, webix.ProgressBar, webix.IdSpace, webix.ui.layout);
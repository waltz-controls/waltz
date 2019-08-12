import {get_device_info} from "./device_info_panel.js";
import newToolbar from "./attrs_monitor_toolbar.js";

const hosts = {
    view: "list",
    id: "hosts",
    select: true,
    autoheight:true,
    template: "<span class='webix_icon fa-desktop' style='color: {common.highlightColor()}'></span><span style='color: {common.highlightColor()}'>#name#</span>",
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


            this.getTopParentView().initializeAdmin(admin).then(() => {
                PlatformContext.devices.setCursor(admin.id);
            });
        },
        onAfterLoad(){
            webix.assert(this.count() !== 0, "assertion error: hosts.count() !== 0");
            this.select(this.getFirstId());
        }
    },
    click(id){
        PlatformContext.devices.setCursor(id);
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
    template: "<span class='webix_icon fa-server' style='color: {common.highlightColor()}'></span><span style='color: {common.highlightColor()}'>#name#</span>",
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
            this.getTopParentView()._update_devices(server)
                .then(device => {
                    PlatformContext.devices.setCursor(device.id);
                    return device;
                });
        }
    }
};



export function _ui(){
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
                            hosts,
                            {
                                template: "Tango Servers:",
                                type: "header"
                            },
                            servers,
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
                                        view: "button",
                                        type: "icon",
                                        icon: "plus",
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
                                template: "Selected Device info:",
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
function connectEpics2Web() {
    return new Promise(function (resolve, reject) {
        try {
            const connection = new jlab.epics2web.ClientConnection();
            connection.onopen = function () {
                webix.message("Connection to Epics2Web is open!");
                resolve(connection);
            };
            connection.onerror = function (err) {
                reject(err);
            };
            connection.onclose = function () {
                reject(new Error("Connection to Epics2Web is closed!"));
            };
        } catch (e) {
            reject(e);
        }
    });
}

function toggleEpics2WebStatusIcon($$epics2web, status) {
    if (status === 'pong') {
        $$epics2web.define({
            icon: 'heartbeat',
            css: {"color": "green"}
        });
        $$epics2web.refresh()
    } else {
        $$epics2web.define({
            icon: 'heart',
            css: {}
        });
        $$epics2web.refresh();
    }
}

export const EpicsMonitorController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newEpicsMonitorTab());
    }

    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api) {
        const $$hq = $$('epics');
        const $$datatable = $$hq.$$('datatable');
        const $$epics2web = $$hq.$$('epics2web');


        $$datatable.epics2web = connectEpics2Web().then(conn => {
            conn.addEventListener('pong', () => {
                toggleEpics2WebStatusIcon($$epics2web, 'pong');
                setTimeout(() => {
                    toggleEpics2WebStatusIcon($$epics2web, 'ping');
                }, 500);
            });

            conn.addEventListener('info', ({detail: {pv, connected, datatype, labels}}) => {
                $$datatable.updateItem(pv, {
                    status: connected,
                    datatype
                });
            });

            conn.addEventListener('update', ({detail: {pv, value, date}}) => {
                $$datatable.updateItem(pv, {
                    value,
                    date
                });
            });
            return conn;
        }).catch(err => {
            TangoWebappHelpers.error("Failed to connect to Epics2Web!", err);
        });

        $$datatable.add({
            id: 'IOC:m1',
            status: 'UNKNOWN'
        });
    }
};

//disable Xenv widget for master
EpicsMonitorController.initialize();

const epics_datatable = webix.protoUI({
    name: 'epics_datatable',
    epics2web: null,
    _config() {
        return {
            columns: [
                {id: 'id'},
                {
                    id: 'status', template(obj) {
                        if (obj.status !== undefined)
                            return obj.status ? "CONNECTED" : "DISCONNECTED";

                    }
                },
                {id: 'datatype'},
                {id: 'value'},
                {id: 'date', fillspace: true},
                {
                    id: "remove", width: 25, header: "", template() {
                        return '<span class="webix_icon remove fa-trash"></span>'
                    }
                }
            ],
            on: {
                onAfterAdd(id) {
                    this.epics2web.then(conn => {
                        conn.monitorPvs([id])
                    });
                },
                onAfterDelete(id) {
                    this.epics2web.then(conn => {
                        conn.clearPvs([id])
                    });
                },
                onBeforeDrop(context) {
                    return this === context.from ||
                        context.from.config.$id === 'attrs';

                }
            },
            externalData: function (data, id) {
                return {id: data.name.replace(/_/g, ':')};
            }
        }
    },
    $init(config) {
        webix.extend(config, this._config());
    },
    defaults: {
        resizeColumn: true,
        drag: true,
        dragColumn: true
    }
}, webix.ui.datatable);

function newEpicsMonitorForm(config = {}) {
    return webix.extend({
        maxHeight: 25,
        view: 'form',
        id: 'form',
        cols: [
            {view: 'text', name: 'id', placeholder: 'EPICS PV name'},
            {
                view: 'button', type: "icon", icon: "plus", value: 'Add', maxWidth: 40, click() {
                    if (this.getFormView().validate())
                        this.getFormView().save();
                }
            },
            {
                id: "epics2web",
                view: "button",
                type: "icon",
                icon: "heart",
                tooltip: "Indicates Epics2Web heartbeat messages",
                maxWidth: 25
            }
        ],
        rules:
            {
                id: webix.rules.isNotEmpty
            }
    }, config);
}

function newEpicsDatatable(config = {}) {
    return webix.extend({
        id: 'datatable',
        view: 'epics_datatable',
        onClick: {
            "remove"(event, cell, target) {
                this.remove(cell.row)
            }
        }
    }, config);
}

const epics_monitor = webix.protoUI({
    name: "epics_monitor",
    _ui() {
        return {
            rows: [
                newEpicsMonitorForm(),
                newEpicsDatatable()
            ]
        }
    },
    monitorPv(pv) {
        this.$$('datatable').add({id: pv})
    },
    $init(config) {
        webix.extend(config, this._ui());

        this.$ready.push(() => {
            this.$$('form').bind(this.$$('datatable'));
        });
    }
}, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newEpicsMonitorTab() {
    return {
        header: "<span class='webix_icon fa-feed'></span> EPICS monitor",
        borderless: true,
        body:
            {
                id: 'epics',
                view: "epics_monitor"
            }
    }
}
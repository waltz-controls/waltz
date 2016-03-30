TangoWebapp.getDevice = function () {
    return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
};

TangoWebapp.openDevicePanel = function (device) {
    webix.ui({
        view: 'Device Panel',
        device: device,
        body: {
            view: "layout",
            rows: [
                {
                    view: "tabview",
                    cells: [
                        {
                            header: "Commands",
                            body: {
                                view: "DevPanelCommands",
                                device: device
                            }
                        },
                        {
                            header: "Attributes",
                            body: {
                                view: "DevPanelAttributes",
                                device: device
                            }
                        },
                        {
                            header: "Pipes",
                            body: {
                                template: "Pipes body"
                            }
                        },
                        {
                            header: "Admin",
                            body: {
                                template: "Admin body"
                            }
                        }
                    ]
                },
                {view: "resizer"},
                {
                    id: 'tmpLog',
                    view: "textarea"
                },
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "button", id: "btnClear", value: "Clear history", width: 100, align: "right",
                            click: function () {
                                this.getTopParentView().$$('tmpLog').setValue('');
                            }
                        },
                        {
                            view: "button",
                            id: "btnDismiss",
                            value: "Close",
                            width: 100,
                            align: "right",
                            click: function () {
                                this.getTopParentView().close()
                            }
                        }]
                }

            ]
        }
    }).show();
};
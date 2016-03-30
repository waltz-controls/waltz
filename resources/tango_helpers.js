TangoWebapp.getDevice = function(){
    return TangoWebapp.devices.getItem(TangoWebapp.devices.getCursor());//TODO assert
};

TangoWebapp.openDevicePanel = function(device){
    webix.ui({
        view:'Device Panel',
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
                                cols:[
                                    {
                                        view:"list",
                                        id: 'commands-list',
                                        select: true,
                                        template:"#name#"
                                    },
                                    {
                                        id:'frmCommand',
                                        view: 'form',
                                        //dataFeed: '...',
                                        elements:[
                                            {
                                                view: 'text',
                                                name: 'argin'
                                            },
                                            {
                                                cols: [
                                                    {
                                                        view: 'text',
                                                        name:'in_type',
                                                        label: 'Argin type:'
                                                    },
                                                    {
                                                        view: 'text',
                                                        name: 'out_type',
                                                        label: 'Argout type'
                                                    }
                                                ]
                                            },
                                            {
                                                cols: [
                                                    {
                                                        view: 'text',
                                                        name:'in_type_desc'
                                                    },
                                                    {
                                                        view: 'text',
                                                        name: 'out_type_desc'
                                                    }
                                                ]
                                            },
                                            {
                                                view: 'button',
                                                name:'btnExecCmd',
                                                value: 'Execute',
                                                disabled: true,
                                                click:function(){
                                                    this.getTopParentView().executeCommand();
                                                }
                                            },
                                            {
                                                view:'button',
                                                id:'btnPlotCmd',
                                                disabled: true,
                                                value: 'Plot',
                                                click:function(){

                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            header: "Attributes",
                            body: {
                                template: "Attributes body"
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
                        {view: "button", id: "btnClear", value: "Clear history", width: 100, align: "right",
                        click:function(){
                            this.getTopParentView().$$('tmpLog').setValue('');
                        }},
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
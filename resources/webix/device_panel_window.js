webix.protoUI({
    name: "DevPanelCommands",
    $init: function(config){
        var device = this._device = config.device;
        this.$ready.push(function(){
            this.$$('frm').bind(this.$$('commands-list'),'$data',function(cmd, cmds){
                if(!cmd) return this.clear();
                if(webix.debug_bind) webix.message("Requesting data for cmd " + cmd.name);
                this.parse(TangoWebapp.rest.devices(device.name).commands(cmd.name).get().then(function(resp){
                    return resp.info;
                }));
                this.elements['btnExecCmd'].enable();
                //TODO enable plot
            })
        });
        this.$ready.push(function(){
            this.$$('commands-list').parse(device.commands());
        });
    },
    _command: new View({url:'views/command_out.ejs'}),
    executeCommand:function(){
        var o = this.$$('frm').getValues();

        var self = this;
        this.getTopParentView().updateLog(this._device.executeCommand(o.cmd_name, o.argin).then(function(resp){
            return self._command.render(resp);
        }));
    },
    defaults: {
        cols: [
            {
                view: "list",
                id: 'commands-list',
                select: true,
                template: "#name#"
            },
            {
                id: 'frm',
                view: 'form',
                //dataFeed: '...',
                elements: [
                    {
                        view: 'text',
                        name: 'argin'
                    },
                    {
                        cols: [
                            {
                                view: 'text',
                                name: 'in_type',
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
                                name: 'in_type_desc'
                            },
                            {
                                view: 'text',
                                name: 'out_type_desc'
                            }
                        ]
                    },
                    {
                        view: 'button',
                        name: 'btnExecCmd',
                        value: 'Execute',
                        disabled: true,
                        click: function () {
                            this.getTopParentView().executeCommand();
                        }
                    },
                    {
                        view: 'button',
                        id: 'btnPlotCmd',
                        disabled: true,
                        value: 'Plot',
                        click: function () {

                        }
                    }
                ]
            }
        ]
    }
}, webix.IdSpace ,webix.ui.layout);

webix.protoUI({
    _dataRecord: null,
    name: "DevPanelAttributes",
    $init:function(config){
        var device = this._device = config.device;
        this.$ready.push(function(){
            this.$$('frm').bind(this.$$('attributes-list'),'$data',function(attr, attrs){
                if(!attr) return this.clear();
                if(webix.debug_bind) webix.message("Requesting data for attr " + attr.name);

                var self = this;
                TangoWebapp.rest.devices(device.name).attributes(attr.name).get('/info').then(function(resp){
                    self.getTopParentView()._dataRecord = new webix.DataRecord(resp);
                    self.elements['info'].setValue(new View({url:'views/dev_panel_attribute_info.ejs'}).render(resp))
                });


                this.elements['btnRead'].enable();
                this.elements['btnWrite'].enable();
                //TODO enable plot
            })
        });
        this.$ready.push(function(){
            this.$$('attributes-list').parse(device.attributes());
        });
    },
    _attribute_out: new View({url:'views/dev_panel_attribute_out.ejs'}),
    readAttribute:function(){
        var o = this._dataRecord.getValues();

        var self = this;
        this.getTopParentView().updateLog(this._device.readAttribute(o.name).then(function(resp){
            return self._attribute_out.render(resp);
        }));
    },
    writeAttribute:function(){
        var argin = this.$$('frm').elements['argin'].getValue();
        var o = this._dataRecord.getValues();

        var self = this;
        this.getTopParentView().updateLog(this._device.writeAttribute(o.name, argin).then(function(resp){
            return self._attribute_out.render(resp);
        }));
    },
    defaults:{
        cols: [
            {
                view: "list",
                id: 'attributes-list',
                select: true,
                template: "#name#"
            },
            {
                id: 'frm',
                view: 'form',
                //dataFeed: '...',
                elements: [
                    {
                        view: 'text',
                        name: 'argin'
                    },
                    {
                        view: "textarea",
                        name: "info"
                    },
                    {
                        cols: [{
                            view: 'button',
                            name: 'btnRead',
                            value: 'Read',
                            disabled: true,
                            click: function () {
                                this.getTopParentView().readAttribute();
                            }
                        },
                            {
                                view: 'button',
                                name: 'btnWrite',
                                disabled: true,
                                value: 'Write',
                                click: function () {
                                    this.getTopParentView().writeAttribute();
                                }
                            },
                            {
                                view: 'button',
                                name: 'btnPlot',
                                disabled: true,
                                value: 'Plot',
                                click: function () {
                                    this.getTopParentView().plotAttribute();
                                }
                            }]
                    }
                ]
            }
        ]
    }
}, webix.IdSpace, webix.ui.layout);

webix.protoUI({
    _device:null,
    name:"Device Panel",
    $init: function(config){
        var device = this._device = config.device;
        this.$ready.push(function(){
            this.getHead().setValues({name:device.name});
        })
    },
    updateLog:function(promise){
        var log = this.$$('tmpLog');
        promise.then(function(val){
            log.setValue(log.getValue() + "\n" + val);
        });
    },
    defaults: {
        head: {template: "Device panel [#name#]"},
        position: "center",
        move: true,
        height: 640,
        width: 720
    }
},webix.IdSpace,webix.EventSystem,webix.ui.window);
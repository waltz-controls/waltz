webix.protoUI({
    _device:null,
    name:"Device Panel",
    $init: function(config){
        var device = this._device = config.device;
        this.$ready.push(function(){
            this.$$('frmCommand').bind(this.$$('commands-list'),'$data',function(cmd, cmds){
                if(!cmd) return this.clear();
                if(webix.debug_bind) webix.message("Requesting data for cmd " + cmd.name);
                this.parse(TangoWebapp.rest.devices(device.name).commands(cmd.name).get().then(function(resp){
                    return resp.info;
                }));
                this.elements['btnExecCmd'].enable();
                //TODO enable plot
            })
        });
    },
    _command: new View({url:'views/command_out.ejs'}),
    executeCommand:function(){
        var o = this.$$('frmCommand').getValues();

        var self = this;
        var log = this.$$('tmpLog');
            this._device.executeCommand(o.cmd_name, o.argin).then(function(resp){
                log.setValue(log.getValue() + self._command.render(resp) + "\n\n");
        });
    },
    defaults: {
        head: {template: "Device panel [#name#]"},
        position: "center",
        move: true,
        height: 640,
        width: 720,
        on:{
            onBeforeShow:function(){
                this.getHead().setValues({name:this._device.name});

                this.$$('commands-list').parse(this._device.commands());
            }
        }
    }
},webix.IdSpace,webix.EventSystem,webix.ui.window);
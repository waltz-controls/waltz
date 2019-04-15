import {commandExecutionHelper} from "./command_view.js";

function showInfo(){
    
}

function getHeader(device) {
    return `<span class='webix_icon ${this.getIcon()}'></span>[<span class='webix_strong'>${device.display_name}/${this.display_name}</span>]`;
}


//TODO make instance functions
function openTab(view, resp) {
    let $$tab = $$(this.id);
    if (!$$tab || !$$tab.isVisible()) {
        const device = PlatformContext.devices.getItem(this.device_id);
        PlatformApi.PlatformUIController().openTangoHostTab(device.host, view);

        $$tab = $$(this.id);
    }

    $$tab.show();
    $$tab.plot.update(resp);
}

//TODO send Open Ajax event and handle it in main_controller
export function openSpectrumWindow(resp) {
    var device = PlatformContext.devices.getItem(this.device_id);
    openTab.bind(this)({
        header: getHeader.call(this, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newSpectrumView(this)
    }, resp);
}

//TODO send Open Ajax event and handle it in main_controller
export function openImageWindow(resp) {
    var device = PlatformContext.devices.getItem(this.device_id);
    openTab.bind(this)({
        header: getHeader.call(this, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newImageView(webix.extend({id: this.id}, resp))
    }, resp);
}

export function openScalarWindow(resp) {
    const device = PlatformContext.devices.getItem(this.device_id);
    openTab.bind(this)({
        header: getHeader.call(this, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newScalarView(webix.extend({id: this.id}, resp))
    }, resp)
}

export function openPipeWindow(resp) {
    const device = PlatformContext.devices.getItem(this.device_id);
    openTab.bind(this)({
        header: getHeader.call(this, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newPipeView(webix.extend({id: this.id}, resp))
    }, resp)
}

export function openCommandWindow(cmd) {
    var device = PlatformContext.devices.getItem(cmd.device_id);
    openTab.bind(cmd)({
        header: getHeader.call(cmd, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newCommandView(cmd)
    }, undefined)
}

export const device_control_attr = webix.protoUI({
    name: "device_control_attr",
    read(){
        if(this.attr === null || !this.validate()) return;
        //TODO update this value
    },
    plot(){
        if(!this.validate()) return;
        //TODO open plot
    },
    plot_hist(){
        if(!this.validate()) return;
        //TODO open plot + read history
    },
    write_minus(){
        if(!this.validate()) return;
        //TODO write current value -
    },
    write_plus(){
        if(!this.validate()) return;
        //TODO write current value +
    },
    write(){
        if(!this.validate()) return;
        //TODO write
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"text", name:"name", label:"Attribute",labelPosition:"top",readonly:true},
                    {view:"button",type:"icon",icon:"info-circle", width:30}
                ]
            },
            {
                cols:[
                    {view:"button",value:"read", click(){ this.getFormView().read()}},
                    {view:"button",value:"plot", click(){ this.getFormView().plot()}},
                    {view:"button",value:"plot.hist", click(){ this.getFormView().plot_hist()}}
                ]
            },
            {
                cols:[
                    {view:"text", name:"value", gravity:2},
                    {view:"button",value:"-", width: 20, click(){ this.getFormView().write_minus()}},
                    {view:"button",value:"+", width: 20, click(){ this.getFormView().write_plus()}},
                    {view:"button",value:"write", click(){ this.getFormView().write()}}
                ]
            }

        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(attr){
                if(!attr) return;
                this.clearValidation();
                this.attr = attr;
                //TODO set validation rules
                //TODO hide input if read only
                //TODO update value
                debugger
            }
        }
    }
},webix.ui.form);

export const device_control_command = webix.protoUI({
    name: "device_control_command",
    execute(){
        if(!this.command) return;
        commandExecutionHelper(this.command, this.$$input);
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"text", name:"name", label:"Command", labelPosition: "top", readonly:true},
                    {view:"button",type:"icon",icon:"info-circle", width:30}
                ]
            },
            {id:"input_holder",rows:[
                    {}
                ], hidden: true},
            {view:"button",value:"execute", click(){this.getFormView().execute()}}
        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(command){
                if(command === null) return;
                if(command.info.in_type !== 'DevVoid') {
                    this.$$input = $$(webix.ui([{view: "command_input", cmd: command, type: "mini"}], this.$$('input_holder'))[0].id);
                    this.$$('input_holder').show();
                } else {
                    this.$$('input_holder').hide();
                }
                this.command = command;
            }
        }
    }
},webix.IdSpace, webix.ui.form);

export const device_control_pipe = webix.protoUI({
    name: "device_control_pipe",
    read(){
        if(!this.validate() || this.pipe === null) return;
        UserAction.readPipe(this.pipe)
            .then(openPipeWindow.bind(this.pipe));
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"text", name:"name", label:"Pipe", labelPosition: "top", readonly:true},
                    {view:"button",type:"icon",icon:"info-circle", width:30}
                ]
            },
            {view:"button",value:"read", click(){this.getFormView().read();}}
        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(pipe){
                this.pipe = pipe;
            }
        }
    }
},webix.ui.form);
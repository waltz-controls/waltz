import {commandExecutionHelper} from "./command_view.js";

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
    if(!resp) return;
    const device = PlatformContext.devices.getItem(resp.device_id);
    openTab.bind(resp)({
        header: getHeader.call(resp, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newPipeView(webix.extend({id: resp.id}, resp))
    }, resp)
}

export function openCommandWindow(cmd) {
    if(!cmd) return;
    var device = PlatformContext.devices.getItem(cmd.device_id);
    openTab.bind(cmd)({
        header: getHeader.call(cmd, device),
        close: true,
        borderless: true,
        body: TangoWebapp.ui.newCommandView(cmd)
    }, undefined)
}

export function openAttributeWindow(attr) {
    if(!attr) return;
    if (attr.info.data_format === "SPECTRUM") {
        return UserAction.readAttribute(attr)
            .then(openSpectrumWindow.bind(attr));
    } else if (attr.info.data_format === "IMAGE") {
        return UserAction.readAttribute(attr)
            .then(openImageWindow.bind(attr));
    } else if (attr.info.data_format === "SCALAR") {
        return UserAction.readAttribute(attr)
            .then(openScalarWindow.bind(attr));
    } else {
        TangoWebappHelpers.error("Unsupported data format: " + attr.info.data_format);
    }
}

export const device_control_attr = webix.protoUI({
    name: "device_control_attr",
    read(){
        if(this.attr === null) return;
        this.attr.read().then(resp => this.$$input.setValue(resp.value));
    },
    plot(){
        if(this.attr === null) return;
        openAttributeWindow(this.attr);
    },
    plot_hist(){
        if(!this.validate()) return;
        UserAction.readAttributeHistory(this.attr)
            .then(() => {
                return openAttributeWindow(this.attr);
            }).then(()=>{
                $$(this.attr.id).plot.updateMulti(this.attr.history);
            });
    },
    showInfo(){
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.attr.id,
                kind: "attrs"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        openAttributeWindow(this.attr);
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"label",id:"label", label:"Attribute:"},
                    {view:"button",type:"icon",icon:"info-circle", width:30, click(){this.getFormView().showInfo()}},
                    {view:"button",type:"icon",icon:"eye", width:30, click(){this.getFormView().goto()}}
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
                id: "input_holder", rows:[
                    {}
                ]
            }

        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(attr){
                this.attr = attr;
                if(!attr) return;

                if(attr.info.writable.includes('WRITE') && attr.info.data_format !== "IMAGE") {
                    this.$$input = $$(webix.ui([{view: "scalar_input", attr, type: "compact", borderless: true}], this.$$('input_holder'))[0].id);

                    this.$$('input_holder').show();
                } else if(attr.info.data_format !== "IMAGE") {
                    this.$$input = $$(webix.ui([{view: "text", readonly:true, borderless: true}], this.$$('input_holder'))[0].id);

                    this.$$('input_holder').show();
                } else {
                    this.$$('input_holder').hide();
                }

                this.$$('label').define("label",`Attribute: ${attr.display_name}`);
                this.$$('label').refresh();

                attr.read().then(resp => this.$$input.setValue(resp.value));
            }
        }
    }
},webix.IdSpace, webix.ui.form);

export const device_control_command = webix.protoUI({
    name: "device_control_command",
    execute(){
        if(!this.command) return;
        commandExecutionHelper(this.command, this.$$input);
    },
    showInfo(){
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.command.id,
                kind: "commands"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        openCommandWindow(this.command);
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"label",id:"label", label:"Command: "},
                    {view:"button",type:"icon",icon:"info-circle", width:30, click(){this.getFormView().showInfo()}},
                    {view:"button",type:"icon",icon:"eye", width:30, click(){this.getFormView().goto()}}
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
                this.command = command;
                if(command === null) return;

                if(command.info.in_type !== 'DevVoid') {
                    const value = this.$$input ? this.$$input.getValue(): undefined;
                    this.$$input = $$(webix.ui([{view: "command_input", cmd: command, type: "mini", borderless: true}], this.$$('input_holder'))[0].id);
                    this.$$input.setValue(value);
                    this.$$('input_holder').show();
                } else {
                    this.$$('input_holder').hide();
                }

                this.$$('label').define("label",`Command: ${command.display_name}`);
                this.$$('label').refresh();
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
    showInfo(){
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.pipe.id,
                kind: "pipes"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        openPipeWindow(this.pipe);
    },
    defaults:{
        elements:[
            {cols:[
                    {view:"label",id:"label", label:"Pipe:"},
                    {view:"button",type:"icon",icon:"info-circle", width:30, click(){this.getFormView().showInfo()}},
                    {view:"button",type:"icon",icon:"eye", width:30, click(){this.getFormView().goto()}}
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
                if(!pipe) return;
                this.$$('label').define("label",`Pipe: ${pipe.display_name}`);
                this.$$('label').refresh();
            }
        }
    }
}, webix.IdSpace,webix.ui.form);
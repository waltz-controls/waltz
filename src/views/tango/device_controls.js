import "views/tango/scalar_input";
import "views/tango/command_view";

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
        return attr.read()
            .then(openSpectrumWindow.bind(attr));
    } else if (attr.info.data_format === "IMAGE") {
        return attr.read()
            .then(openImageWindow.bind(attr));
    } else if (attr.info.data_format === "SCALAR") {
        return attr.read()
            .then(openScalarWindow.bind(attr));
    } else {
        TangoWebappHelpers.error("Unsupported data format: " + attr.info.data_format);
    }
}

export const device_control_attr = webix.protoUI({
    name: "device_control_attr",
    ui(){
        return {
            elements:[
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

            ]
        }
    },
    read(){
        if(this.attr === null) return;
        this.config.root.readAttribute(this.attr);
    },
    plot(){
        if(this.attr === null) return;
        openAttributeWindow(this.attr);
    },
    plot_hist(){
        if(this.attr === null) return;
        this.attr.fetchHistory()
            .then(() => {
                return openAttributeWindow(this.attr);
            }).then(()=>{
                $$(this.attr.id).plot.updateMulti(this.attr.history);
            });
    },
    showInfo(){
        if(this.attr === null) return;
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.attr.id,
                kind: "attrs"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        if(this.attr === null) return;
        openAttributeWindow(this.attr);
    },
    reset(){
        this.attr = null;
        if(this.$$input) {
            this.$$input.destructor();
            this.$$input = null;
        }
    },
    $init(config){
        webix.extend(config, this.ui());
    },
    defaults:{
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            /**
             *
             * @param {Member} attr
             */
            onBindApply(attr){
                this.attr = attr;
                if(!attr) return;

                if(attr.writable && !attr.isImage()) {
                    this.$$input = $$(webix.ui([{view: "scalar_input", attr, type: "compact", borderless: true, root: this.config.root}], this.$$('input_holder'))[0].id);

                    this.$$input.setValues(attr);

                    this.$$('input_holder').show();
                } else if(!attr.isImage()) {
                    this.$$input = $$(webix.ui([{view: "text", readonly:true, borderless: true, value: attr.value}], this.$$('input_holder'))[0].id);

                    this.$$('input_holder').show();
                } else {
                    this.$$('input_holder').hide();
                }
            }
        }
    }
}, webix.IdSpace, webix.ui.form);

export const device_control_command = webix.protoUI({
    name: "device_control_command",
    execute(){
        if(!this.command) return;
        let argin;
        if (this.command.isVoid()) {
            argin = undefined;
        } else {
            if (!this.$$input.validate()) return;
            argin = this.$$input.getValue();
        }

        this.config.root.executeCommand(this.command, argin);
    },
    showInfo(){
        if(!this.command) return;
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.command.id,
                kind: "commands"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        if(!this.command) return;
        openCommandWindow(this.command);
    },
    reset(){
        this.command = null;
    },
    defaults:{
        elements:[
            {id:"input_holder",rows:[
                    {}
                ], hidden: true},
            {view:"button",value:"execute", click(){this.getFormView().execute()}}
        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            /**
             *
             * @param {Member} command
             */
            onBindApply(command){
                this.command = command;
                if(command === null) return;

                if(command.data_type !== 'DevVoid') {
                    const value = this.$$input ? this.$$input.getValue(): undefined;
                    this.$$input = $$(webix.ui([{view: "command_input", cmd: command, type: "mini", borderless: true}], this.$$('input_holder'))[0].id);
                    this.$$input.setValue(value);
                    this.$$('input_holder').show();
                } else {
                    this.$$('input_holder').hide();
                }
            }
        }
    }
},webix.IdSpace, webix.ui.form);

export const device_control_pipe = webix.protoUI({
    name: "device_control_pipe",
    read(){
        if(!this.pipe) return;
        this.config.root.readPipe(this.pipe);
    },
    showInfo(){
        if(this.pipe === null) return;
        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: this.pipe.id,
                kind: "pipes"
            }
        });

        $$('info_control_panel_header').expand();
    },
    goto(){
        if(this.pipe === null) return;
        openPipeWindow(this.pipe);
    },
    reset(){
        this.pipe = null;
    },
    defaults:{
        elements:[
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
}, webix.IdSpace,webix.ui.form);

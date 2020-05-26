import "views/tango/scalar_input";
import "views/tango/command_view";

function defaultButtons(){
    return {
        height:24,
        cols:[
            {
                height:24,
            },
            {
                height: 24,
                width: 32,
                borderless: true,
                type: 'clean',
                template: `<button class="webix_icon_button" style="width: 24px; height: 24px;"><span class="goto webix_list_icon mdi mdi-open-in-new"></span></button>`,
                onClick: {
                    "goto"() {
                        this.getFormView().goto();
                    }
                }
            },
            {
                height:24,
                width:32,
                borderless: true,
                type: 'clean',
                template:`<button class="webix_icon_button" style="width: 24px; height: 24px;"><span class="close webix_list_icon mdi mdi-close"></span></button>`,
                onClick:{
                    "close"() {
                        this.getFormView().hide();
                    }
                }
            }]
    };
}

export const device_control_attr = webix.protoUI({
    name: "device_control_attr",
    ui(){
        return {
            elements:[
                // defaultButtons(),
                {
                    cols:[
                        {view:"button",id:"read",value:"read", click(){ this.getFormView().read()}},
                        {view:"button",id:"plot", value:"plot", click(){ this.getFormView().plot()}},
                        {view:"button",id:"history",value:"plot.hist", click(){ this.getFormView().plot_hist()}}
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
        if(!this.attr) return;
        return this.config.root.readAttribute(this.attr);
    },
    plot(){
        if(!this.attr) return;
        return this.read()
            .then(response => {
                this.config.root.openAttributeWindow(this.attr)
                    .update(response);
            })
    },
    plot_hist(){
        if(!this.attr) return;
        this.config.root.readAttributeHistory(this.attr)
            .then(response => {
                this.config.root.openAttributeWindow(this.attr)
                    .update(response);
            });
    },
    goto(){
        if(!this.attr) return;
        this.config.root.openAttributeWindow(this.attr);
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
             *TODO can be this done in a better way? dynamic building?
             *
             * @param {TangoAttribute} attr
             */
            onBindApply(attr){
                this.attr = attr;
                if(!attr) return;

                if(!attr.isScalar()){
                    this.$$("history").hide();
                } else {
                    this.$$("history").show();
                }

                if(attr.isImage()){
                    this.$$("read").hide();
                } else {
                    this.$$("read").show();
                }

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
        if (!this.command.isVoid()) {
            if (!this.$$input.validate()) return;
            argin = this.$$input.getValue();
        }

        this.config.root.executeCommand(this.command, argin);
    },
    goto(){
        if(!this.command) return;
        this.config.root.openCommandWindow(this.command);
    },
    reset(){
        this.command = null;
    },
    defaults:{
        elements:[
            // defaultButtons(),
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

                if (command.isVoid()) {
                    this.$$('input_holder').hide();
                } else {
                    const value = this.$$input ? this.$$input.getValue() : undefined;
                    this.$$input = $$(webix.ui([{
                        view: "command_input",
                        cmd: command,
                        type: "mini",
                        borderless: true
                    }], this.$$('input_holder'))[0].id);
                    this.$$input.setValue(value);
                    this.$$('input_holder').show();
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
    goto(){
        if(!this.pipe) return;
        this.config.root.openPipeWindow(this.pipe);
    },
    reset(){
        this.pipe = null;
    },
    defaults:{
        elements:[
            // defaultButtons(),
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

function showInfo(){
    
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

    },
    defaults:{
        elements:[
            {cols:[
                    {view:"text", name:"name", label:"Command", labelPosition: "top", readonly:true},
                    {view:"button",type:"icon",icon:"info-circle", width:30}
                ]
            },
            {view:"text", name:"input", placeholder:"Input", hidden: true},
            {view:"button",value:"execute"}
        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(command){
                debugger
            }
        }
    }
},webix.ui.form);

export const device_control_pipe = webix.protoUI({
    name: "device_control_pipe",
    read(){

    },
    defaults:{
        elements:[
            {cols:[
                    {view:"text", name:"name", label:"Pipe", labelPosition: "top", readonly:true},
                    {view:"button",type:"icon",icon:"info-circle", width:30}
                ]
            },
            {view:"button",value:"read"}
        ],
        rules:{
            "name": webix.rules.isNotEmpty
        },
        on:{
            onBindApply(pipe){
                debugger
            }
        }
    }
},webix.ui.form);
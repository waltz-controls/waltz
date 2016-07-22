webix.protoUI({
    _changeTangoHostWindow:webix.ui({
        view:"window",
        id:"changeTangoHostWindow",
        position:"center",
        move:true,
        height:250,
        width:300,
        head:{view:"button", label:"Close", width:70, click:("$$('changeTangoHostWindow').hide();"), align:"right"},
        body:{
            template:"Some text"
        }
    }),
    changeTangoHost:function(){
        this._changeTangoHostWindow.show();
    },
    name: "MainToolbar",
    $init:function(){

    },
    defaults: {
        data: [
            {id: "btnFile", value: "File", width: 100, align: "left"},
            {id: "btnEdit", value: "Edit", submenu:[{id:"changeTangoHost", value:"Change Tango Host"},"Create Server"]},
            {id: "btnTools", value: "Tools", width: 100, align: "left"},
            {id: "btnFilter", value: "Filter", width: 100, align: "left"},
            {id: "btnHelp", value: "Help", width: 100, align: "left", submenu: [{id: "btnAbout", value: "About"}]}
        ],
        on:{
            onMenuItemClick:function(id){
                webix.message("Click: "+this.getMenuItem(id).value);
                if(this[id]) this[id]();
            }
        }
    }

},webix.IdSpace, webix.EventSystem ,webix.ui.menu);



    TangoWebapp.ToolbarConfig = {
        view: "MainToolbar",
        id: "mainToolbar"
    };
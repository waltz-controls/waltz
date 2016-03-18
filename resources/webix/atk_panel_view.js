webix.protoUI({
    name: "ATKPanel",
    defaults:{
        rows:[
            {
                view: "menu",
                data: [
                    {id: "btnFile", value: "File", width: 100, align: "left"},
                    {id: "btnView", value: "View", submenu:[{id:"testDevice", value:"Test Device", click:function(){alert("Test device");}}]},
                    {id: "btnPreferences", value: "Preferences", width: 100, align: "left"}]
            },
            {
                template: "Device commands"
            },
            {
                view: "template", template: "Header template", type: "section"
            },
            {
                template:"Device status"
            },
            {
                template:"Tabview of attributes"
            }
        ]
    }
},webix.IdSpace, webix.EventSystem, webix.ui.layout);


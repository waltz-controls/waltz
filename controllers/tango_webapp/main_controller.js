/**
* Main controller
*
* @type {TangoWebapp.MainController}
*/
TangoWebapp.MainController = MVC.Controller.extend('main',{
    /**
    * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
    *
    * @param {Object} params
    */
    load: function(params){
        webix.proxy.DevicesTree = {
            $proxy:true,
            source:'http://localhost:8080/localhost/rest/rc2/devices',
            load:function(view, callback){
                //your loading pattern
                alert("load");
                var success = callback[0].success;
                callback[0].success = function(text, xml , loader){
                    alert("success");

                    success(text, xml, loader);
                }
                webix.ajax(this.source, callback, view);
            },
            save:function(view, update, dp, callback){
                //your saving pattern for single records
                alert("save");
                webix.ajax().post(url, data, callback);
            },
            saveAll:function(view, update, dp, callback){
                //your saving pattern
                alert("saveAll");
                for (var i = 0; i < updates.length; i++) { alert("updates is probably undefined"); }
            },
            result:function(state, view, dp, text, data, loader){
                //your logic of serverside response processing
                alert("result");
                dp.processResult(state, data, details);
            }
        }


        var tree = {
            view: "tree",
            id:"myTree",
            type:'lineTree',
            data: []
        };

    	webix.ui({
            rows:[
                { view:"template",
                    type:"header", template:"Tango Web Application" },
                {
                    cols: [
                        tree,
                        {view:"resizer"},
                        {
                            view: "datatable",
                            autoConfig: true,
                            editable: false,
                            url: 'http://localhost:8080/localhost/rest/rc2/devices/sys/tg_test/1'
                        }


                    ]
                },
                {
                    view: "datatable",
                    autoConfig: true,
                    data:[]
                }
            ]
        });

        tree.data =  [{id:"root", value:"Cars", open:true, data:[
            { id:"1", open:true, value:"Toyota", data:[
                { id:"1.1", value:"Avalon" },
                { id:"1.2", value:"Corolla" },
                { id:"1.3", value:"Camry" }
            ]},
            { id:"2", value:"Skoda", open:true, data:[
                { id:"2.1", value:"Octavia" },
                { id:"2.2", value:"Superb" }
            ]}
        ]}];

        $$('myTree').refresh();
    }
});
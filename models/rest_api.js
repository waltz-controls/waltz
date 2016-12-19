RestApiHost = MVC.Model.extend("rest_api_host",
    /*@Static */
    {
        attributes:{
            host :"string",
            port :"number",
            version: "string",
            databases: "Object"
        }
    },
    /*@Prototype */
    {
        init: function(attrs){
            attrs = attrs || {};
            attrs.databases = new webix.DataCollection();
            this._super(attrs);
        },
        getDb: function (){
            return this.databases.getItem(this.databases.getCursor());
        },
        addDb: function(tango_host){
            var db = new DataBase(tango_host);
            var dbId = this.databases.add(db);
            this.databases.setCursor(db.id = dbId);
        },
        toString: function () {
            return [this.host,':', this.port,"; ver=", this.version].join('');
        },
        toUrl: function(){
            return ['http://',this.host,':', this.port,'/tango/rest/', this.version ,'/'].join('');
        }
    }
);
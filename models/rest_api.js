RestApiHost = MVC.Model.Cookie.extend("rest_api_host",
    /*@Static */
    {
        days: 30,
        attributes:{
            id: "number",
            host :"string",
            port :"number",
            version: "string"
        },
        default_attributes:{}
    },
    /*@Prototype */
    {
        databases: "Object",
        set_databases: function(v){
            this.databases = v;
        },
        init: function(attrs){
            attrs = attrs || {};
            attrs.databases = new webix.DataCollection();
            this._super(attrs);
            var id = str_to_hash(this.toString());
            this._setProperty("id", id);
            this.Class.create(this.attributes());
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
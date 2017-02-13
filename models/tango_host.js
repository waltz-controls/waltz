TangoHost = MVC.Model.Cookie.extend("tango_host",
    /*@Static */
    {
        days: 30,
        attributes:{
            host:"string",
            port :"number",
            id: "number",
            value: "string"
        },
        default_attributes:{}
    },
    /*@Prototype */
    {
        init: function(attrs){
            this._super(attrs);
            this.value = this.host + ":" + this.port;
            var id = str_to_hash(this.value);
            this._setProperty("id", id);
            this.Class.create(this.attributes());
        },
        toString: function(){
            return this.value;
        },
        toUrl: function(){
            return this.host + "/" + this.port;
        }
    }
);
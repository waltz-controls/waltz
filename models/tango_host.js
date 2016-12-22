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
        default_attributes:{},
        hashCode : function(str) {
            var hash = 0, i, chr, len;
            if (str.length === 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
    },
    /*@Prototype */
    {
        init: function(attrs){
            this._super(attrs);
            this.value = this.host + ":" + this.port;
            var id = this.Class.hashCode(this.value);
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
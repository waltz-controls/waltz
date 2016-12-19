TangoHost = MVC.Model.extend("tango_host",
    /*@Static */
    {
        attributes:{
            host:"string",
            port :"number"
        },
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
            var id = this.Class.hashCode(this.toString());
            this._setProperty("id", id);
        },
        toString: function(){
            return this.host + ":" + this.port;
        },
        toUrl: function(){
            return this.host + "/" + this.port;
        }
    }
);
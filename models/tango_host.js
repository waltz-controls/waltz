TangoHost = MVC.Model.extend("tango_host",
    /*@Static */
    {
        attributes:{
            host:"string",
            port :"number"
        }
    },
    /*@Prototype */
    {
        toString: function(){
            return this.host + ":" + this.port;
        },
        toUrl: function(){
            return this.host + "/" + this.port;
        }
    }
);
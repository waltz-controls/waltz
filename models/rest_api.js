RestApiHost = MVC.Model.extend("rest_api_host",
    /*@Static */
    {
        attributes:{
            host :"string",
            port :"number",
            version: "string"
        }
    },
    /*@Prototype */
    {
        toString: function () {
            return [this.host,':', this.port,"; ver=", this.version].join('');
        },
        toUrl: function(){
            return ['http://',this.host,':', this.port,'/tango/rest/', this.version ,'/'].join('');
        }
    }
);
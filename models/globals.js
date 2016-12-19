TangoGlobals = MVC.Model.extend("tango_globals",
    /* @Static */
    {
        associations: {
            has: ["RestApiHost", "TangoHost"]
        },
        attributes: {
            rest_api_host: "RestApiHost",
            tango_host: "TangoHost"
        },
        default_attributes: {
            rest_api_host: {
                host: "localhost",
                port: 8080,
                version: "rc3"
            },
            tango_host: {
                host: "hzgxenvtest",
                port: 10000
            }
        }
    },
    /* @Prototype */
    {}
);
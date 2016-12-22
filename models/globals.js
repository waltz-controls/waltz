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
                host: TangoWebapp.consts.REST_API_HOST,
                port: TangoWebapp.consts.REST_API_PORT,
                version: TangoWebapp.consts.REST_API_VERSION
            },
            tango_host: {
                host: TangoWebapp.consts.TANGO_HOST,
                port: TangoWebapp.consts.TANGO_PORT
            }
        }
    },
    /* @Prototype */
    {}
);
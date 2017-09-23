/**
 * Model tango_database
 *
 * @type {TangoDatabase}
 */
TangoWebapp.TangoDatabase = MVC.Model.extend('tango_database',
    /* @Static */
    {

        attributes: {
            id: 'string',
            info: 'string[]',
            device: 'TangoDevice'
        },
        default_attributes: {}


    },
    /* @Prototype */
    {
        /**
         *
         * @param name
         * @return {*|Promise}
         */
        getDeviceInfo: function (name) {

            return this.device.executeCommand("DbGetDeviceInfo", name).then(function (resp) {
                return {
                    exported: resp.output.lvalue[0] == 1,
                    pid: resp.output.lvalue[1],
                    name: resp.output.svalue[0],
                    ior: resp.output.svalue[1],
                    idl: resp.output.svalue[2],
                    admin: resp.output.svalue[3],
                    host: resp.output.svalue[4],
                    started_at: resp.output.svalue[5], //TODO parse
                    stopped_at: resp.output.svalue[6], //TODO parse
                    device_class: resp.output.svalue[7]
                };
            });
        }
        //TODO commands
    }
);

if (window['TangoDatabase'] === undefined)
    TangoDatabase = TangoWebapp.TangoDatabase;
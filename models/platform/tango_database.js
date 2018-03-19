/**
 * Model tango_database
 *
 * @type {TangoDatabase}
 */
TangoWebappPlatform.TangoDatabase = MVC.Model.extend('tango_database',
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
        },
        /**
         * Returns error response if alias is not set - limitation of the native Tango API
         *
         * @param name
         * @return {*|Promise}
         */
        getDeviceAlias: function (name) {
            return this.device.executeCommand("DbGetDeviceAlias", name)
                .then(function(resp){
                    return resp.output;
                })
        },
        /**
         *
         * @param svalue
         */
        addDevice: function (svalue) {
            return this.device.executeCommand("DbAddDevice", svalue);
        },
        /**
         *
         * @param wildcard
         */
        getDeviceDomainList: function (wildcard) {
            return this.device.executeCommand("DbGetDeviceDomainList", wildcard);
        },
        /**
         *
         * @param wildcard
         */
        getDeviceFamilyList: function (wildcard) {
            return this.device.executeCommand("DbGetDeviceFamilyList", wildcard);
        },
        /**
         *
         * @param wildcard
         */
        getDeviceMemberList: function (wildcard) {
            return this.device.executeCommand("DbGetDeviceMemberList", wildcard);
        },
        /**
         *
         * @param {[]} args
         * @returns {*|webix.promise}
         */
        getDeviceProperty: function (args) {
            return this.device.executeCommand("DbGetDeviceProperty", args)
        },
        /**
         *
         * @param device
         * @return {*|webix.promise}
         */
        deleteDevice: function (device) {
            return this.device.executeCommand("DbDeleteDevice", device);
        }
        //TODO commands
    }
);

if (window['TangoDatabase'] === undefined)
    TangoDatabase = TangoWebappPlatform.TangoDatabase;
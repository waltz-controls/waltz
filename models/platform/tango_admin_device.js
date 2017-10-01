/**
 * Model tango_admin_device
 *
 * @type {TangoAdminDevice}
 */
TangoAdminDevice = MVC.Model.extend('tango_admin_device',
    /* @Static */
    {

        attributes: {
            device: 'TangoDevice'
        },
        default_attributes: {}
    },
    /* @Prototype */
    {
        /**
         *
         * @param longStringValue
         * @returns {webix.promise}
         */
        addObjPolling: function (longStringValue) {
            return this.device.executeCommand('AddObjPolling', longStringValue)
        },
        /**
         *
         * @param longStringValue
         * @returns {*|webix.promise}
         */
        updObjPollingPeriod: function (longStringValue) {
            return this.device.executeCommand('UpdObjPollingPeriod', longStringValue)
        },
        /**
         *
         * @param args
         * @returns {*|webix.promise}
         */
        remObjPolling: function (args) {
            return this.device.executeCommand('RemObjPolling', args)
        },
        /**
         *
         * @param {[]} args
         * @returns {*|webix.promise}
         */
        getLoggingLevel: function (args) {
            return this.device.executeCommand("GetLoggingLevel", args)
        },
        /**
         *
         * @param {string} arg - device name
         * @returns {*|webix.promise}
         */
        getLoggingTarget: function (arg) {
            return this.device.executeCommand("GetLoggingTarget", arg);
        },
        /**
         *
         * @param device
         * @returns {Promise}
         */
        devPollStatus: function (device) {
            return this.device.executeCommand('DevPollStatus', device);
        }
    }
);
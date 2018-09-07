/**
 * Model tango_admin_device
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @namespace {TangoWebappPlatform}
 * @memberof TangoWebappPlatform
 * @property {TangoDevice} device
 */
TangoAdminDevice = MVC.Model.extend('tango_admin_device',
    /** @lends  TangoWebappPlatform.TangoAdminDevice */
    {

        attributes: {
            device: 'TangoDevice'
        },
        default_attributes: {}
    },
    /** @lends  TangoWebappPlatform.TangoAdminDevice.prototype */
    {
        /**
         * @param longStringValue
         * @returns {webix.promise}
         */
        addObjPolling: function (longStringValue) {
            return this.device.executeCommand('AddObjPolling', longStringValue)
        },
        /**
         * @param longStringValue
         * @returns {*|webix.promise}
         */
        updObjPollingPeriod: function (longStringValue) {
            return this.device.executeCommand('UpdObjPollingPeriod', longStringValue)
        },
        /**
         * @param args
         * @returns {*|webix.promise}
         */
        remObjPolling: function (args) {
            return this.device.executeCommand('RemObjPolling', args)
        },
        /**
         * @param {} args
         * @returns {*|webix.promise}
         */
        getLoggingLevel: function (args) {
            return this.device.executeCommand("GetLoggingLevel", args)
        },
        /**
         * @param {string} arg - device name
         * @returns {*|webix.promise}
         */
        getLoggingTarget: function (arg) {
            return this.device.executeCommand("GetLoggingTarget", arg);
        },
        /**
         * @param device
         * @returns {Promise}
         */
        devPollStatus: function (device) {
            return this.device.executeCommand('DevPollStatus', device);
        }
    }
);
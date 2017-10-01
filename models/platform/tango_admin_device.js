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
         * @param device
         * @returns {Promise}
         */
        devPollStatus: function (device) {
            return this.device.executeCommand('DevPollStatus', device);
        }
    }
);
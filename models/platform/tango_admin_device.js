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
         * @param device
         * @returns {Promise}
         */
        devPollStatus: function (device) {
            return this.device.executeCommand('DevPollStatus', device);
        }
    }
);
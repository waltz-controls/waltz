/**
 * Model tango_pipe
 *
 * @type {TangoPipe}
 */
TangoPipe = MVC.Model.extend('tango_pipe',
    /** @Static */
    {
        attributes: {
            id: 'string', //host_id/device_id/name
            name: 'string',
            device_id: 'string'
        },
        default_attributes: {}
    },
    /** @Prototype */
    {
        _get_device_id: function () {
            return this.id.substr(0, this.id.lastIndexOf('/'));
        },
        /**
         * @returns {webix.promise}
         */
        read: function () {
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.readPipe(this.name);
        },
        /**
         *
         * @param {Object} value
         * @returns {webix.promise}
         */
        write: function (value) {
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.writePipe(this.name, value);
        }
    }
);
/**
 * Model tango_attribute
 *
 * @type {TangoAttribute}
 */
TangoAttribute = MVC.Model.extend('tango_attribute',
    /** @Static */
    {

        attributes: {
            id: 'string',//host_id/device_id/name
            name: 'string',
            device_id: 'string'
            //TODO value
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
            var device_id = this._get_device_id();

            var device = PlatformContext.devices.getItem(device_id);

            return device.fetchAttrValues([this.name]).then(function (resp) {
                return resp[0];
            });
        },
        /**
         *
         * @param value
         * @returns {webix.promise}
         */
        write: function (value) {
            var device_id = this._get_device_id();

            var device = PlatformContext.devices.getItem(device_id);

            var values = {};
            values[this.name] = value;
            return device.putAttrValues(values).then(function (resp) {
                return resp[0];
            });
        }
    }
);
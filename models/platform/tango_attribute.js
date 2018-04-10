(function () {
    var handle_resp = function (resp) {
        var result = resp[0];
        if (result.quality === 'FAILURE' || result.errors)
            throw result;
        else return result;
    };

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
                device_id: 'string',
                info: 'DataCollection',
                value: 'any'
            },
            default_attributes: {
                value: undefined
            }
        },
        /** @Prototype */
        {
            /**
             * @returns {webix.promise}
             */
            read: function () {
                var device = PlatformContext.devices.getItem(this.device_id);
                return device.fetchAttrValues([this.name]).then(handle_resp);
            },
            /**
             *
             * @param value
             * @returns {webix.promise}
             */
            write: function (value) {
                var device = PlatformContext.devices.getItem(this.device_id);

                var values = {};
                values[this.name] = value;
                return device.putAttrValues(values).then(handle_resp);
            },
            /**
             *
             * @returns {*|webix.promise}
             */
            putInfo: function () {
                var device = PlatformContext.devices.getItem(this.device_id);

                return device.toTangoRestApiRequest().attributes(this.name).put('/info?async=true', this.info);
            }
        }
    );
})();

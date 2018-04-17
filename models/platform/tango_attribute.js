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
                device_id: 'string'
                //TODO value
            },
            default_attributes: {},
            /**
             *
             * @param id
             * @return {{tango_host: string, tango_port: number, device: string, name: string}}
             */
            parseId:function(id){
                var parts = id.split('/');

                return {
                    id: id,
                    host:parts[0],
                    device:[parts[1],parts[2], parts[3]].join('/'),
                    name:parts[4]
                }
            }
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


                return device.fetchAttrValues([this.name]).then(handle_resp);
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
                return device.putAttrValues(values).then(handle_resp);
            },
            /**
             *
             * @returns {*|webix.promise}
             */
            //TODO extract AttributeInfo (aka MVC.Model.JSON) and move this method there
            putInfo: function () {
                var device_id = this._get_device_id();

                var device = PlatformContext.devices.getItem(device_id);

                return device.toTangoRestApiRequest().attributes(this.name).put('/info?async=true', this.info);
            }
        }
    );
})();

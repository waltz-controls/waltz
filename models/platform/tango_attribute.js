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
            store_type: WebixDataCollectionStorage,
            attributes: {
                id: 'string',//host_id/device_id/name
                name: 'string',
                device_id: 'string',
                info: 'DataCollection',
                value: 'object'
            },
            default_attributes: {
            }
        },
        /** @Prototype */
        {
            init:function(attrs){
                this._super(attrs);
                this.value = {
                    value: undefined,
                    quality: undefined,
                    timestamp: undefined
                }
            },
            /**
             * @returns {webix.promise}
             */
            read: function () {
                var device = PlatformContext.devices.getItem(this.device_id);
                return device.fetchAttrValues([this.name]).then(function(resp){
                    this.update_attributes({
                        value: resp[0]
                    })
                }.bind(this));
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
            //TODO extract AttributeInfo (aka MVC.Model.JSON) and move this method there
            putInfo: function () {
                var device = PlatformContext.devices.getItem(this.device_id);

                return device.toTangoRestApiRequest().attributes(this.name).put('/info?async=true', this.info);
            }
        }
    );
})();

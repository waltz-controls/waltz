/**
 * Model tango_command
 *
 * @type {TangoCommand}
 */
TangoCommand = MVC.Model.extend('tango_command',
    /** @Static */
    {
        store_type: WebixDataCollectionStorage,
        attributes: {
            id: 'string',//host_id/device_id/name
            device_id: 'string',
            name: 'string',
            info: 'object'
            //TODO history
        },
        default_attributes: {}
    },
    /** @Prototype */
    {
        /**
         *
         * @param attrs
         * @constructor
         */
        init: function (attrs) {
            this._super(attrs)
        },
        /**
         *
         * @param argin
         *
         * @returns {webix.promise}
         */
        execute: function (argin) {
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.executeCommand(this.name, argin);
        }
    }
);
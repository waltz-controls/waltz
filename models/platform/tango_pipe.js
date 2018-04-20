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
            display_name: 'string'
        },
        default_attributes: {}
    },
    /** @Prototype */
    {
        _get_device_id: function () {
            return this.id.substr(0, this.id.lastIndexOf('/'));
        },
        /**
         *
         * @param attrs
         * @constructor
         */
        init:function(attrs){
            attrs.display_name = attrs.display_name || attrs.name;
            this._super(attrs);
        },
        /**
         * @returns {webix.promise}
         */
        read: function () {
            var device_id = this._get_device_id();

            var device = PlatformContext.devices.getItem(device_id);

            return device.readPipe(this.name);
        },
        /**
         *
         * @param {Object} value
         * @returns {webix.promise}
         */
        write: function (value) {
            var device_id = this._get_device_id();

            var device = PlatformContext.devices.getItem(device_id);

            return device.writePipe(this.name, value);
        }
    }
);
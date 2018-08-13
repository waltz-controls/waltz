/**
 * Model tango_device_property
 * @class
 * @type {TangoDeviceProperty}
 * @property {string} id
 * @property {string} name
 * @property {string} device_id
 * @property {[]} values
 * @extends MVC.Model
 */
TangoDeviceProperty = MVC.Model.extend('tango_device_property',
    /** @lends  TangoDeviceProperty */
    {

        attributes: {
            id: 'string',
            name: 'string',
            device_id: 'string',
            values:'[]'
        },
        default_attributes: {}
    },
    /** @lends  TangoDeviceProperty.prototype */
    {
        /**
         *
         * @returns {webix.promise}
         */
        get:function(){
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.fetchProperty(this.name);
        },
        /**
         *
         * @param {[]} values
         */
        set:function(values){
            this.values = [];
            return this.update(values);
        },
        /**
         *
         * @param {[]} values
         * @returns {webix.promise}
         */
        update:function(values){
            var device = PlatformContext.devices.getItem(this.device_id);

            var props = Object.create(null);
            props[this.name] = this.values.concat(values);
            return device.putProperties(props);
        },
        /**
         *
         * @returns {'DEVICE_PROPERTY'}
         */
        getDataFormat: function () {
            return 'DEVICE_PROPERTY';
        }
    }
);
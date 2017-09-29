/**
 * Model tango_device_property
 *
 * @type {TangoDeviceProperty}
 */
TangoDeviceProperty = MVC.Model.extend('tango_device_property',
    /* @Static */
    {

        attributes: {
            id: 'string',
            name: 'string'
        },
        default_attributes: {}
    },
    /* @Prototype */
    {}
);
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
    {}
);
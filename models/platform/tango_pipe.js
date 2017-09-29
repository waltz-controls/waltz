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
            name: 'string'
        },
        default_attributes: {}
    },
    /** @Prototype */
    {}
);
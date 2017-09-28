/**
 * Model tango_command
 *
 * @type {TangoCommand}
 */
TangoCommand = MVC.Model.extend('tango_command',
    /** @Static */
    {

        attributes: {
            id: 'string',//device_id/name
            name: 'string',
            info: 'object'
            //TODO history
        },
        default_attributes: {}
    },
    /** @Prototype */
    {
        init: function (attrs) {
            this._super(attrs)
        }
    }
);
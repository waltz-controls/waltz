/**
 * Model tango_database
 *
 * @type {TangoDatabase}
 */
TangoWebapp.TangoDatabase = MVC.Model.extend('tango_database',
    /* @Static */
    {

        attributes: {
            id: 'string',
            info: 'string[]',
            device: 'TangoDevice'
        },
        default_attributes: {}


    },
    /* @Prototype */
    {
        //TODO commands
    }
);

if (window['TangoDatabase'] === undefined)
    TangoDatabase = TangoWebapp.TangoDatabase;
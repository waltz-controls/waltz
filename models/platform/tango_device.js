/**
 * Model tango_device
 *
 * @type {TangoDevice}
 */
TangoWebapp.TangoDevice = TangoWebapp.DataCollectionWrapper.extend('tango_device',
    /* @Static */
    {
        attributes: {
            id: 'string', //host_id/name
            name: 'string',
            info: '{}',
            attrs: '[]',
            commands: '[]',
            pipes: '[]'
        },
        default_attributes: {}
    },
    /* @Prototype */
    {
        admin: null,
        host: null,
        set_admin: function (v) {
            this.admin = v;
        },
        set_host: function (v) {
            this.host = v;
        },
        fetchAttributes: function () {

        },
        fetchCommands: function () {

        },
        fetchPipes: function () {

        },
        fetchAdmin: function () {

        }
    }
);

if (window['TangoDevice'] === undefined)
    TangoDevice = TangoWebapp.TangoDevice;
/**
 * Model tango_command
 *
 * @type {TangoCommand}
 */
TangoCommand = MVC.Model.extend('tango_command',
    /** @Static */
    {

        attributes: {
            id: 'string',//host_id/device_id/name
            name: 'string',
            display_name: 'string',
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
            attrs.display_name = attrs.display_name || attrs.name;
            if(attrs.name === 'State' || attrs.name === 'Status') attrs.id = attrs.id + '_cmd'; //TODO may append _cmd multiple times

            this._super(attrs);
        },
        /**
         *
         * @param argin
         *
         * @returns {webix.promise}
         */
        execute: function (argin) {
            var device_id = this.id.substr(0, this.id.lastIndexOf('/'));

            var device = PlatformContext.devices.getItem(device_id);

            return device.executeCommand(this.name, argin);
        },
        /**
         *
         * @returns {'COMMAND'}
         */
        getDataFormat:function(){
            return 'COMMAND';
        }
    }
);
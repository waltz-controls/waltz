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
            device_id: 'string',
            name: 'string',
            display_name: 'string',
            info: 'object',
            input: 'any',
            output: 'any'
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
            var device = PlatformContext.devices.getItem(this.device_id);

            this.update_attributes({
                input: argin
            });
            return device.executeCommand(this.name, argin).then(function(resp){
                this.update_attributes(resp);
                return this;
            }.bind(this));
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
/**
 * Model tango_command
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @namespace {TangoWebappPlatform}
 * @memberof TangoWebappPlatform
 * @property {string} id
 * @property {string} device_id
 * @property {string} name
 * @property {string} display_name
 * @property {string} info
 * @property {string} input
 * @property {string} output
 */
TangoCommand = MVC.Model.extend('tango_command',
    /** @lends  TangoWebappPlatform.TangoCommand */
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
    /** @lends  TangoWebappPlatform.TangoCommand.prototype */
    {
        /**
         *
         * @param attrs
         * @constructs
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
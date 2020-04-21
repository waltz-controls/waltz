/**
 * Model tango_command
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @class
 * @memberof tango
 * @property {string} id
 * @property {string} device_id
 * @property {string} name
 * @property {string} display_name
 * @property {string} info
 * @property {string} input
 * @property {string} output
 */
TangoCommand = TangoPollable.extend('tango_command',
    /** @lends  tango.TangoCommand */
    {

        attributes: {
            id: 'string',//host_id/device_id/name
            device_id: 'string',
            name: 'string',
            display_name: 'string',
            info: 'object',
            input: 'any',
            output: 'any',
            //TODO history
        },
        default_attributes: {
            polling_type: 'command'
        }
    },
    /** @lends  tango.TangoCommand.prototype */
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
         * Uses this#input as argin
         *
         * @return {PromiseLike<T | never> | Promise<T | never>}
         */
        executeWithPredefinedInput(){
            var device = PlatformContext.devices.getItem(this.device_id);
            return device.executeCommand(this.name, this.input).then(function(resp){
                this.update_attributes(resp);
                return resp;
            }.bind(this));
        },
        /**
         *
         * @param argin
         *
         * @returns {webix.promise}
         */
        execute: function (argin) {
            this.update_attributes({
                input: argin
            });
            return this.executeWithPredefinedInput();
        },
        /**
         *
         * @returns {'COMMAND'}
         */
        getDataFormat:function(){
            return 'COMMAND';
        },
        /**
         *
         */
        getIcon:function(){
            if(this.name === 'State' || this.name === 'Status') return 'mdi mdi-heart-pulse';

            return 'mdi mdi-play-box-outline';
        }
    }
);

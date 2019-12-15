/**
 * Model tango_pipe
 *
 * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
 * @class
 * @memberof tango
 * @property {string} id
 * @property {string} name
 * @property {string} display_name
 */
TangoPipe = MVC.Model.extend('tango_pipe',
    /** @lends  tango.TangoPipe */
    {

        attributes: {
            id: 'string', //host_id/device_id/name
            name: 'string',
            display_name: 'string',
            timestamp: 'int',
            size: 'int',
            data:'[]'
        },
        default_attributes: {}
    },
    /** @lends  tango.TangoPipe.prototype */
    {
        _get_device_id: function () {
            return this.id.substr(0, this.id.lastIndexOf('/'));
        },
        /**
         * @param attrs
         * @constructs
         */
        init:function(attrs){
            attrs.display_name = attrs.display_name || attrs.name;
            this._super(attrs);
        },
        /**
         * @returns {webix.promise}
         */
        read: function () {
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.readPipe(this.name).then(function(resp){
                this.update_attributes(resp);
                return this;
            }.bind(this));
        },
        /**
         * @param {Object} value
         * @returns {webix.promise}
         */
        write: function (value) {
            var device = PlatformContext.devices.getItem(this.device_id);

            return device.writePipe(this.name, value).then(function(resp){
                this.update_attributes(resp);
                return this;
            }.bind(this));
        },
        /**
         * @returns {'PIPE'}
         */
        getDataFormat:function(){
            return 'PIPE';
        },
        /**
         *
         * @return {string}
         */
        getIcon:function(){
            return 'mdi mdi-card-text-outline';
        }
    }
);
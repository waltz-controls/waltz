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
            name: 'string',
            display_name: 'string'
        },
        default_attributes: {}
    },
    /** @Prototype */
    {
        _get_device_id: function () {
            return this.id.substr(0, this.id.lastIndexOf('/'));
        },
        /**
         *
         * @param attrs
         * @constructor
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
         *
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
         *
         * @returns {'PIPE'}
         */
        getDataFormat:function(){
            return 'PIPE';
        }
    }
);
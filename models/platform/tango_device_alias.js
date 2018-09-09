/**
 *
 */
TangoWebappPlatform.TangoDeviceAlias = MVC.Model.extend('tango_device_alias',
    /** @lends  TangoWebappPlatform.TangoDeviceAlias */
    {
        attributes: {
            id: 'int',
            value: 'string',
            device: 'TangoDevice'
        },
        default_attributes: {}


    },
    /** @lends  TangoWebappPlatform.TangoDeviceAlias.prototype */
    {
        host: null,
        set_host:function(v){
            this.host = v;
        },
        /**
         *
         * @param attrs
         * @constructs
         */
        init:function(attrs){
            MVC.Object.extend(attrs, {
                id: webix.uid()
            });
            this._super(attrs)
        },
        /**
         *
         * @return {Promise<TangoDevice>}
         */
        fetchDevice:function(){
            if(this.device != null) return webix.promise.resolve(this.device);
            return this.host.fetchDatabase()
                .then(function(db){
                    return db.getAliasDevice(this.value);
                }.bind(this))
                .then(function(device_name){
                    return this.host.fetchDevice(device_name);
                }.bind(this))
                .then(function(device){
                    this.device = device;
                    return device;
                }.bind(this))
        }
    }
    );

if (window['TangoDeviceAlias'] === undefined)
    TangoDeviceAlias = TangoWebappPlatform.TangoDeviceAlias;
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
        fetchDevice:function(){
            //TODO
        }
    }
    );

if (window['TangoDeviceAlias'] === undefined)
    TangoDeviceAlias = TangoWebappPlatform.TangoDeviceAlias;
/**
 *
 */
TangoWebappPlatform.TangoMember= MVC.Model.extend('tango_member',
    /** @lends  TangoWebappPlatform.TangoMember */
    {
        attributes: {
            id: 'int',
            value: 'string',
            host: 'TangoHost',
            device: 'TangoDevice'
        },
        default_attributes: {}


    },
    /** @lends  TangoWebappPlatform.TangoMember.prototype */
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
        /**
         *
         * @return {Promise<TangoDevice>}
         */
        fetchDevice:function(){
            if(this.device != null) return webix.promise.resolve(this.device);
            return this.host.fetchDevice(this.family.domain.value + "/" + this.family.value + "/" + this.value);
        }
    }
    );

if (window['TangoMember'] === undefined)
    TangoMember = TangoWebappPlatform.TangoMember;
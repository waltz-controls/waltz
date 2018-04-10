/**
 * Model tango_attribute_info
 *
 * @type {TangoAttributeInfo}
 */
TangoAttributeInfo = MVC.Model.extend('tango_attribute_info',
    /* @Static */
    {
        dynamic: true,
        attributes: {
            id:'string'//attr_id/info
        },
        default_attributes: {}
    },
    /* @Prototype */
    {
        set_attr:function(v){
            this.attr = v;
        },
        init:function(attrs){
            this._super(MVC.Object.extend(attrs, {
                id: attrs.attr.id + "/info"
            }));

            attrs.attr.update_attributes({
                info: this
            });
        },
        put:function(){
            var device = PlatformContext.devices.getItem(this.attr.device_id);

            return device.toTangoRestApiRequest().attributes(this.attr.name).put('/info?async=true', this.attributes());
        }

    }
    );
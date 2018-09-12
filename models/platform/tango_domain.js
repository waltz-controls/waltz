/**
 *
 * @class
 * @memberof tango
 */
TangoWebappPlatform.TangoDomain = MVC.Model.extend('tango_domain',
    /** @lends  tango.TangoDomain */
    {
        attributes: {
            id: 'int',
            value: 'string',
            host: 'TangoHost',
            families: 'TangoFamily[]'
        },
        default_attributes: {}


    },
    /** @lends  tango.TangoDomain.prototype */
    {
        /**
         *
         * @param attrs
         * @constructs
         */
        init:function(attrs){
            MVC.Object.extend(attrs, {
                id: webix.uid(),
                families: new webix.DataCollection() //TODO filter host families???
            });
            this._super(attrs);
        },
        /**
         *
         * @param filter
         * @return {Promise<TangoFamily>}
         */
        fetchFamilies:function(filter){
            if(filter.split('/')[0] !== this.value) return webix.promise.resolve([]);

            return this.host.fetchDatabase()
                .then(function(db){
                    return db.getDeviceFamilyList(filter || this.value + '/*');
                }.bind(this))
                .then(function(families){
                    var tango_host = this.host;
                    var tango_domain = this;
                    var families = TangoWebappPlatform.TangoFamily.create_many_as_existing(families.output.map(function(it){
                        return {
                            value: it,
                            host: tango_host,
                            domain: tango_domain
                        }
                    }));

                    this.families.parse(families);
                    this.host.families.parse(families);
                    return families;
                }.bind(this))
        }
    }
    );

if (window['TangoDomain'] === undefined)
    TangoDomain = TangoWebappPlatform.TangoDomain;
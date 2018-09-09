/**
 *
 */
TangoWebappPlatform.TangoFamily = MVC.Model.extend('tango_family',
    /** @lends  TangoWebappPlatform.TangoFamily */
    {
        attributes: {
            id: 'int',
            value: 'string',
            host: 'TangoHost',
            domain: 'TangoDomain',
            members: 'TangoMember[]'
        },
        default_attributes: {}


    },
    /** @lends  TangoWebappPlatform.TangoFamily.prototype */
    {
        /**
         *
         * @param attrs
         * @constructs
         */
        init:function(attrs){
            MVC.Object.extend(attrs, {
                id: webix.uid(),
                members: new webix.DataCollection()
            });
            this._super(attrs);
        },
        /**
         *
         * @param filter
         * @return {Promise<TangoMember>}
         */
        fetchMembers:function(filter){
            return this.host.fetchDatabase()
                .then(function(db){
                    return db.getDeviceMemberList(filter || this.domain.value + '/' + this.value + '/*');
                }.bind(this))
                .then(function(members){
                    var tango_host = this.host;
                    var tango_family = this;
                    var members = TangoWebappPlatform.TangoMember.create_many_as_existing(members.output.map(function(it){
                        return {
                            value: it,
                            host: tango_host,
                            family: tango_family
                        }
                    }));

                    this.members.parse(members);
                    this.host.members.parse(members);
                    return members;
                }.bind(this))
        }
    }
    );

if (window['TangoFamily'] === undefined)
    TangoFamily = TangoWebappPlatform.TangoFamily;
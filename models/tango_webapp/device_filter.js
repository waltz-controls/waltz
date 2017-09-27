/**
 * Model device_filter
 *
 * @type {DeviceFilter}
 * @class
 */
DeviceFilter = MVC.Model.extend('device_filter',
    /* @Static */
    {
        store_type: TangoWebappStorage,
        id: "user",
        attributes: {
            user: "string",
            value: 'string[]'
        },
        default_attributes: {
            user: "default"
        }
    },
    /* @Prototype */
    {
        domain_filter:[],
        family_filter:[],
        member_filter:[],

        init: function(params){
            this._super(params);

            this.domain_filter =
                this.value.map(function(it){
                    return it.split('/')[0] + "*"});
            this.family_filter =
                this.value.map(function(it){
                    return it.split('/')[0] + '/' + it.split('/')[1]});
            this.member_filter =
                this.value.map(function(it){
                    return it});

            //have to do it here 'cauz localStorage supports only strings -> store has new instance instead of a ref
            this.Class.store.create(this);
            console.log(["Created new DeviceFilter[user=",this.user,", value=",this.value,"]"].join(''));
        },
        getFamilyFilters: function (domain) {
            return this.value.filter(function(it){
                return it.startsWith(domain) || it.startsWith("*");
            }).map(function (it) {
                var result = domain + '/' + it.split('/')[1];
                if(!result.endsWith("*")) result += "*";
                return result;
            })
        },
        getMemberFilters:function(domain, family){
            return this.value.filter(function(it){
                return (it.split('/')[0] == domain || it.split('/')[0] === "*")
                    && (it.split('/')[1] == family || it.split('/')[1] === "*");
            }).map(function(it){
                return [domain, family, it.split('/')[2]].join('/');
            })
        }
    }
);
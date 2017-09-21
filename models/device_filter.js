/**
 * Model device_filter
 *
 * @type {DeviceFilter}
 */
DeviceFilter = MVC.Model.extend('device_filter',
    /* @Static */
    {

        attributes: {
            value: 'string[]'
        },
        default_attributes: {}
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
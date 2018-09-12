/**
 * Model device_filter
 * @class
 * @type {DeviceFilter}
 * @property {string} user
 * @property {string[]} value
 * @extends MVC.Model
 * @memberof TangoWebappPlatform
 */
DeviceFilter = MVC.Model.extend('device_filter',
    /** @lends  TangoWebappPlatform.DeviceFilter */
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
    /** @lends  TangoWebappPlatform.DeviceFilter.prototype */
    {
        /** @member {domain_filter} */
        domain_filter:[],
        /** @member {family_filter} */
        family_filter:[],
        /** @member {member_filter} */
        member_filter:[],
        /**
         * @param params
         * @constructs
         */
        init: function(params){
            this._super(params);

            var domains_map = this.value
                .map(function(it){
                    return it.split('/')[0] + "*"});
            this.domain_filter =
                domains_map
                    .filter(function (item, pos) {
                        return this.indexOf(item) === pos}, domains_map);
            var families_map = this.value.map(function(it){
                return it.split('/')[0] + '/' + it.split('/')[1]});
            this.family_filter =
                families_map.filter(function (item, pos) {
                    return this.indexOf(item) === pos}, families_map);
            this.member_filter =
                this.value.map(function(it){
                    return it});

            //have to do it here 'cauz localStorage supports only strings -> store has new instance instead of a ref
            this.Class.store.create(this);
            console.log(["Created new DeviceFilter[user=",this.user,", value=",this.value,"]"].join(''));
        },
        /**
         * @return {boolean} true if this filter
         */
        isUniversal:function(){
            return this.value.length === 1 && this.value[0] === '*/*/*';
        },
        /**
         *
         */
        getDomainFilters: function(){
            return this.domain_filter;
        },
        /**
         * @param domain
         */
        getFamilyFilters: function (domain) {
            return this.family_filter.filter(function(it){
                return it.startsWith(domain) || it.startsWith("*");
            }).map(function (it) {
                var result = domain + '/' + it.split('/')[1];
                if(!result.endsWith("*")) result += "*";
                return result;
            })
        },
        /**
         * @param domain
         * @param family
         */
        getMemberFilters:function(domain, family){
            return this.member_filter.filter(function(it){
                //TODO use regex here
                return (it.split('/')[0] == domain || it.split('/')[0] === "*")
                    && (it.split('/')[1] == family || it.split('/')[1] === "*");
            }).map(function(it){
                return [domain, family, it.split('/')[2]].join('/');
            })
        }
    }
);
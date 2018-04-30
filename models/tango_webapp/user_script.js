/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
UserScript = TangoWebapp.UserScript = MVC.Model.extend('user_script',
    /** @Static */
    {
        store_type: WebixDataCollectionStorage,
        id: 'name',
        attributes:{
            name: 'string',
            code: 'string',
            func: 'function'
        },
        default_attributes: {
            
        }
    },
    /** @Prototype */
    {
        
        set_code:function(v){
            this.code = v;
            this.func = new Function("'use strict';" + v);
        },
        /**
         * executes this script
         *
         * @return {Promise}
         */
        execute:function(){
            var result = webix.promise.defer();
            try {
                result.resolve(this.func.apply(PlatformApi));
            } catch (e) {
                this.errors.push(e);
                result.reject(this);
            }
            return result;
        }
    });



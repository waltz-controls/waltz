/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
UserScript = TangoWebapp.UserScript = MVC.Model.extend('user_script',
    /** @Static */
    {
        id: 'name',
        attributes:{
            name: 'string',
            code: 'function'
        },
        default_attributes: {
            
        }
    },
    /** @Prototype */
    {
        
        set_code:function(v){
            if(typeof v === 'function') this.code = v;
            else {
                v  = "'use strict';" + v;
                this.code = new Function(v);
            }
        },
        /**
         * executes this script
         *
         * @return {Promise}
         */
        execute:function(){
            var result = webix.promise.defer();
            try {
                result.resolve(this.code.call(PlatformContext));
            } catch (e) {
                this.errors.push(e);
                result.reject(this);
            }
            return result;
        }
    });



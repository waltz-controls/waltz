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
                this.code = new Function('PlatformContext', v);
            }
        },
        /**
         * executes this script passing PlatformContext as argument
         *
         * @return {Promise}
         */
        execute:function(){
            // web workers are normally js files, but using blobs
            // you can create them with strings.
            var result = webix.promise.defer();

            var blob = new Blob([this.code.toString() + "; onmessage = function(e){PlatformContext = e;};postMessage(anonymous(PlatformContext));"], {
                type: "text/javascript"
            });

            var wk = new Worker(window.URL.createObjectURL(blob));
            wk.postMessage(PlatformContext);
            wk.onmessage = function(e) {
                // you listen for the return.
                console.log('Function result:', e.data);
                result.resolve(e.data);
            };

            wk.onerror = function(e) {
                console.log('There is an error with your worker!');
                result.reject(e.message)
            };

            return result;

            // try {
            //     return this.code.apply(null, [PlatformContext]);
            // } catch (e) {
            //     console.error("UserScript["+ this.name +"] has failed", e);
            //     this.errors.push(e);
            // }
        }
    });



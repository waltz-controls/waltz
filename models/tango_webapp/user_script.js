/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 * @class
 * @type {UserScript}
 * @property {string} name
 * @property {string} code
 * @property {function} func
 * @extends MVC.Model
 * @memberof TangoWebappPlatform
 */
UserScript = TangoWebapp.UserScript = MVC.Model.extend('user_script',
    /** @lends  TangoWebappPlatform.UserScript */
    {
        store_type: WebixDataCollectionStorage,
        id: 'name',
        attributes:{
            name: 'string',
            code: 'string',
            func: 'function'
        },
        default_attributes: {
            
        },
        AsyncFunction: Object.getPrototypeOf(async function(){}).constructor
    },
    /** @lends  TangoWebappPlatform.UserScript.prototype */
    {

        /**
         * @param {string} v
         */
        set_code:function(v){
            this.code = v.trim();
            this.func = new this.Class.AsyncFunction("'use strict';" + this.code);
        },
        /**
         * executes this script
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



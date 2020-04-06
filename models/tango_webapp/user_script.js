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
        set_result(v){
            this.result = v;
        },
        /**
         * executes this script
         * @return {Promise}
         */
        execute:function(){
            return this.func.apply(PlatformApi)
                .then(result => {
                    this.set_result(result);
                    return this;
                })
                .catch(err => {
                    this.errors.push(err);
                    throw this;
                });
        }
    });



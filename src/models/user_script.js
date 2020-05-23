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
export default class UserScript {
    constructor({id,code}) {
        this.id = id;
        this.code = code.trim();
        this.func = new Function(`return async function(context) { 'use strict'; ${this.code} }`)() ;
        this.errors = [];
        this.result = null;
    }

    get name(){
        return this.id;
    }

    /**
     *
     * @param context
     * @return {Promise<*>}
     */
    execute(context){
        return this.func(context)
            .then(result => {
                this.result = result;
                return this;
            })
            .catch(err => {
                this.errors.push(err);
                throw this;
            });
    }
}



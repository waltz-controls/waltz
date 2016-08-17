/**
 * Provides JSONP functionality similar to [MVC.IO.Ajax MVC.Ajax]
 * Available options are:
 * <ul>
 *     <li>remove_script [boolean] -- indicates whether script tag will be removed after executing callbacks
 *     <li>error_timeout [int](ms) -- how long the script will wait for a response
 *     <li>callback_name [String] -- callback parameter name
 *     <li>session [function, string] -- session id
 *     <li>method [string] -- http method, must be supported by the server side
 *     <li>onSuccess [function(response)] -- positive callback (if server responses in time)
 *     <li>onFailure [function(response)] -- failure callback (in case timeout)
 * </ul>
 *
 * @constructor MVC.IO.JsonP
 * @alias MVC.JsonP
 */
MVC.JsonP = function(url, options){
    this.url = url;
    this.options = options || {};
    if(!this.options.callback_name) this.options.callback_name = "cbk";
    this.remove_script = this.options.remove_script == false ? false : true;
    this.options.parameters = this.options.parameters || {};
    this.error_timeout = this.options.error_timeout || 7000;
    this.send();
    
}

MVC.JsonP.prototype = {
    send : function(){
        var n = 'c'+MVC.get_random(5);

        if(this.options.session){
            var session = typeof this.options.session == 'function' ? this.options.session() : this.options.session;
            this.url += (MVC.String.include(this.url,';') ? '&' : ';') + MVC.Object.to_query_string(session);
        }

        var params  = typeof this.options.parameters == 'function' ? this.options.parameters() : this.options.parameters; //will eval everytime
        

        this.url += (MVC.String.include(this.url,'?') ? '&' : '?') + MVC.Object.to_query_string(params);
        this.add_method();

        var callback_name = this.callback_and_random(n);
        
        var error_callback = this.options.onFailure;
        var error_timer = this.check_error(this.url, error_callback);
        
        MVC.JsonP._cbs[callback_name] = MVC.Function.bind(function(callback_params){
            clearTimeout(error_timer);
			this._remove_scripts();
            delete MVC.JsonP._cbs[callback_name];

            //convert to a transport
            var transport = {};
            if(callback_params == null){
            	transport.responseText = "";
            }else if(typeof callback_params == 'string'){
            	transport.responseText = callback_params
                //TODO assume that this is an internal error of the server?!
            }else{
            	transport = callback_params;
            	transport.responseText = callback_params.toString();
            }

            if (this.options.onSuccess)
               this.options.onSuccess(transport);
		},this);
        include({path: this.url});
    },
    add_method : function(){
        if(this.options.method && this.options.method != 'get') this.url += "&_method="+this.options.method;
    },
    callback_and_random : function(n){
        
        
        //if(this.options.callback){
        //    this.url += "&callback=" +this.options.callback+"&"+n
        //    return this.options.callback;
        //}
        this.options.callback = "MVC.JsonP._cbs."+n;
        this.url += "&" + this.options.callback_name + "=" +this.options.callback;
        return n;
    },
    check_error : function(url, error_callback){
        return setTimeout(function(){
            console.error("TIMEOUT from:"+url);
            if(error_callback)
                error_callback({
                    responseText:"No response from the server!"
                });
        }, this.error_timeout)
    },
    /**
     * Removes script tag associated with this JSONP
     */
    remove_scripts : function(){
        this.remove_script = true;
        setTimeout(MVC.Function.bind(this._remove_scripts,this), 2000 )
    },
    _remove_scripts : function(){
        if(!this.remove_script) return;
        var scripts = document.getElementsByTagName('script');
        var search = new RegExp(this.url);
        for(var s = 0; s < scripts.length; s++){
            var script = scripts[s];
            if(MVC.String.include( script.src.toLowerCase() ,this.url.toLowerCase())) script.parentNode.removeChild(script);
        }
    }
}
MVC.JsonP._cbs = {};
MVC.IO.JsonP = MVC.JsonP;
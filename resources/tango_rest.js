function TangoREST(url) {
    this._root = url;
    this._url = this._root;
}

/**
 * @returns {TangoREST}
 */
TangoREST.prototype.devices = function (name) {
    this._url += '/devices/';
    this._url += name;
    return this;
};

/**
 *
 * @param name
 * @returns {TangoREST}
 */
TangoREST.prototype.commands = function (name) {
    //TODO check devices branch
    this._url += '/commands/';
    this._url += name;
    return this;
};


/**
 * @returns {Promise}
 */
TangoREST.prototype.exec = function () {
    //TODO check commands branch
    if (arguments.length > 0) {
        this._url += "?";
        for (var i = 0, size = arguments.length; i < size; ++i) {
            this._url += arguments[i];
            this._url += '=';
            this._url += arguments[++i];
            this._url += '&'
        }
    }

    return this.put();
};

/**
 *
 * @returns {*|string|string|string|string|string}
 * @private
 */
TangoREST.prototype._resetUrl = function(){
    var url = this._url;
    this._url = this._root;
    return url;
};

/**
 *
 * @param resp
 * @returns {*}
 * @private
 */
TangoREST.prototype._success = function (resp) {
    var json = resp.json();

    if (json.quality == 'FAILURE' && json.errors && json.errors.length > 0) {
        for (var i = 0, size = json.errors.length; i < size; ++i) {
            console.error(json.errors[i].severity + ":" + json.errors[i].description);
            webix.message({type: 'error', text: json.errors[i].description});
        }
        throw json;
    }

    return json;
};

TangoREST.prototype._failure = function (resp) {
    console.error(resp.statusText + ":" + resp.responseURL);
    webix.message({type: 'error', text: resp.statusText + ":" + resp.responseURL});
    throw resp;
};



/**
 *
 * @returns {Promise}
 */
TangoREST.prototype.get = function (what) {
    //TODO save stack trace
    var url = this._resetUrl();
    if(what) url += what;
    return webix.ajax().get(url).then(this._success).fail(this._failure);
};

/**
 *
 * @returns {Promise}
 */
TangoREST.prototype.put = function(what){
    var url = this._resetUrl();
    if(what) url += what;
    return webix.ajax().put(url).then(this._success).fail(this._failure);
};
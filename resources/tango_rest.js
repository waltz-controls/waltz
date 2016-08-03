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
 * @returns {TangoREST}
 */
TangoREST.prototype.properties = function () {
    this._url += '/properties';
    return this;
};

/**
 * @returns {TangoREST}
 */
TangoREST.prototype.pipes = function (name) {
    this._url += '/pipes/' + name;
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
 *
 * @param name
 * @returns {TangoREST}
 */
TangoREST.prototype.attributes = function(name){
    //TODO check devices branch
    this._url += '/attributes/';
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
        this._url += Array.from(arguments).map(function(arg){return "input="+arg}).join('&');
    }

    return this.put();
};

/**
 *
 * @returns {*|string|string|string|string|string}
 * @private
 */
TangoREST.prototype._resetUrl = function () {
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
    if (resp.text().length != 0) {
        var json = resp.json();

        if (json.quality == 'FAILURE') {
            throw json;
        }

        return json;
    } else {
        webix.log("Response content is empty...");
    }
};

TangoREST.prototype._failure = function (resp) {
    if (resp.errors && resp.errors.length > 0) //tango rest specific
        for (var i = 0, size = resp.errors.length; i < size; ++i) {
            webix.message({type: 'error', text: resp.errors[i].description});
            console.error(resp.errors[i].severity + ":" + resp.errors[i].description);
        }
    else { //general failure
        webix.message({type: 'error', text: resp.statusText + ":" + resp.responseURL});
        console.error(resp.statusText + ":" + resp.responseURL);
    }
    throw resp; //TODO
};


/**
 *
 * @returns {Promise}
 */
TangoREST.prototype.get = function (what) {
    //TODO save stack trace
    var url = this._resetUrl();
    if (what) url += what;
    return webix.ajax().get(url).then(this._success).fail(this._failure);
};

/**
 *
 * @returns {Promise}
 */
TangoREST.prototype.put = function (what, data) {
    var url = this._resetUrl();
    if (what) url += what;//TODO if no what is provided data will be treated as what -> failure
    return webix.ajax().headers({
        "Content-type":"application/json"
    }).put(url, JSON.stringify(data)).then(this._success).fail(this._failure);
};

TangoREST.prototype.delete = function (what) {
    var url = this._resetUrl();
    if (what) url += what;
    return webix.ajax().del(url).then(this._success).fail(this._failure);
};
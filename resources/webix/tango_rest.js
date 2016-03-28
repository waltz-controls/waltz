function TangoREST(url) {
    this._root = url + '/';
    this._devices = url + '/devices/';
    this._url = this._root;
}

/**
 * @returns {TangoREST}
 */
TangoREST.prototype.devices = function () {
    this._url = this._devices;
    return this;
};

/**
 *
 * @param url
 * @return Promise
 */
TangoREST.prototype.get = function (url) {

    return webix.ajax().get(this._url + url).then(function (resp) {
        var json = resp.json();

        if (json.quality == 'FAILURE' && json.errors && json.errors.length > 0) {
            for (var i = 0, size = json.errors.length; i < size; ++i) {
                console.error(json.errors[i].severity + ":" + json.errors[i].description);
                webix.message({type: 'error', text: json.errors[i].description});
            }
            throw json;
        }

        return json;
    });
};
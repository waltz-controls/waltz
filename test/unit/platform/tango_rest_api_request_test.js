webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
    x.withCredentials = true;
    headers["Authorization"] = "Basic " + btoa("tango-cs:tango");
});


new MVC.Test.Unit('tango_rest_api_request', {
    test_simple: function () {
        var instance = new TangoRestApiRequest({url: "http://localhost:10001/tango/rest/rc4"});

        instance.get().then(this.next_callback("check_simple"));
    },
    check_simple: function (resp) {
        this.assert_equal("basic", resp['x-auth-method']);
    },
    test_failure_no_fail: function () {
        var instance = new TangoRestApiRequest({url: "http://localhost:10001/tango/rest/xxx"});//does not exists

        instance.get().then(this.next_callback("check_failure_not_invoked"));
        this._delays--;//we expect no callbacks are executed
    },
    test_failure: function () {
        var instance = new TangoRestApiRequest({url: "http://localhost:10001/tango/rest/xxx"});//does not exists

        instance.get().then(this.next_callback("check_failure_not_invoked")).fail(this.next_callback("check_failure"));
        this._delays--;//only one of the call back must be executed
    },
    check_failure_not_invoked: function () {
        this.assert(false, "normal then should not be called here");
    },
    check_failure: function (resp) {
        this.assert(true);
    }
});
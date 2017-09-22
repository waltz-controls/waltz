new MVC.Test.Unit('tango_device', {
    test_fetch: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("hzgxenvtest", 10000).then(this.next_callback("onHostLoaded"));
    },
    onHostLoaded: function (host) {
        this.assert(true);
        host.fetchDevice("sys/tg_test/1").then(this.next_callback("check_fetch"));
    },
    check_fetch: function (resp) {
        this.assert_equal("hzgxenvtest:10000/sys/tg_test/1", resp.id);
    }

});
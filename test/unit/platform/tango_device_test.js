new MVC.Test.Unit('tango_device', {
    test_fetch_device: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("hzgxenvtest", 10000).then(this.next_callback("onHostLoaded"));
    },
    onHostLoaded: function (host) {
        this.assert(true);
        host.fetchDevice("sys/tg_test/1").then(this.next_callback("check_fetch"));
    },
    check_fetch: function (resp) {
        this.assert_equal("hzgxenvtest:10000/sys/tg_test/1", resp.id);
    },
    test_fetch_database: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("hzgxenvtest", 10000).then(this.next_callback("onHostLoaded1"));
    },
    onHostLoaded1: function (host) {
        this.assert(true);
        host.fetchDatabase().then(this.next_callback("check_fetch1"));
    },
    check_fetch1: function (resp) {
        this.assert_equal("hzgxenvtest:10000/sys/database/2", resp.id);
    }


});
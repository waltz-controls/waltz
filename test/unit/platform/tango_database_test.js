new MVC.Test.Unit('tango_database', {
    test_getInfo: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDatabase();
            })
            .then(function (db) {
                return db.getDeviceInfo("sys/tg_test/1");
            })
            .then(this.next_callback("check_fetch"));
    },
    check_fetch: function (info) {
        debugger
        this.assert_equal("sys/tg_test/1", info.name);
    }
});
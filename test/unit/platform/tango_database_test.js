new MVC.Test.Unit('tango_database', {
    test_getInfo: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDatabase();
            })
            .then(function (db) {
                return db.getDeviceInfo("sys/tg_test/1");
            })
            .then(this.next_callback("check_fetch"));
    },
    check_fetch: function (info) {
        this.assert_equal("sys/tg_test/1", info.name);
    },
    test_getAliases: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchAliases();
            })
            .then(function (aliases) {
                debugger
            })
    }
});
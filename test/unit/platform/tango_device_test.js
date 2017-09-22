new MVC.Test.Unit('tango_device', {
    test_fetch_device: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDevice("sys/tg_test/1");
            })
            .then(this.next_callback("check_fetch"));
    },
    check_fetch: function (device) {
        this.assert_equal("localhost:10000/sys/tg_test/1", device.id);
    },
    test_fetch_database: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDatabase();
            })
            .then(this.next_callback("check_fetch1"));
    },
    check_fetch1: function (db) {
        this.assert_equal("localhost:10000/sys/database/2", db.id);
    }
});
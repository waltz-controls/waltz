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
        this.assert_equal("sys/tg_test/1", device.name);
        this.assert(device.info.exported);
        this.assert_not(device.host == null);
        this.assert_equal("localhost:10000", device.host.id);
    },
    test_fetch_non_existing_device: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDevice("sys/tg_test/XXX");
            })
            .fail(this.next_callback("check_catch"));
    },
    check_catch: function (resp) {
        this.assert_equal("ExecuteCommandException", resp.errors[0].reason);
    },
    test_fetch_non_running_device: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDevice("development/status_server/test");
            })
            .then(this.next_callback("check_fetch2"))
            .fail(this.next_callback("check_failure"));
    },
    check_fetch2: function (device) {
        this._delays--;
        this.assert_equal("localhost:10000/development/status_server/test", device.id);
    },
    check_failure: function (resp) {
        this._delays--;
        this.assert_equal("ExecuteCommandException", resp.errors[0].reason);
    },
    test_exec_cmd_on_non_exported_device: function () {
        var api = new TangoRestApi({url: 'http://localhost:10001'});
        api.fetchHost("localhost", 10000)
            .then(function (host) {
                return host.fetchDevice("development/status_server/test");
            })
            .then(function (device) {
                return device.executeCommand("State");
            })
            .fail(this.next_callback("check_catch1"));
    },
    check_catch1: function (resp) {
        this.assert_equal("TangoProxyException", resp.errors[0].reason);
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
        this.assert_equal("sys/database/2", db.device.name);
    }
});
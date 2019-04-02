new MVC.Test.Unit('tango_device', {
    test_fetch_device: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(this.next_callback("check_fetch"));
    },
    check_fetch: function (device) {
        this.assert_equal(TestValues.tango_host + "/sys/tg_test/1", device.id);
        this.assert_equal("sys/tg_test/1", device.name);
        this.assert(device.info.exported);
        this.assert_not(device.host == null);
        this.assert_equal(TestValues.tango_host, device.host.id);
    },
    test_fetch_non_existing_device: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice("sys/tg_test/XXX");
            })
            .fail(this.next_callback("check_catch"));
    },
    check_catch: function (resp) {
        this.assert_equal("ExecuteCommandException", resp.errors[0].reason);
    },
    test_fetch_non_running_device: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice("development/status_server/test");
            })
            .then(this.next_callback("check_fetch2"))
            .fail(this.next_callback("check_failure"));
    },
    check_fetch2: function (device) {
        this._delays--;
        this.assert_equal(TestValues.tango_host + "/development/status_server/test", device.id);
    },
    check_failure: function (resp) {
        this._delays--;
        this.assert_equal("ExecuteCommandException", resp.errors[0].reason);
    },
    test_exec_cmd_on_non_exported_device: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
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
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDatabase();
            })
            .then(this.next_callback("check_fetch1"));
    },
    check_fetch1: function (db) {
        this.assert_equal(TestValues.tango_host + "/sys/database/2", db.id);
        this.assert_equal("sys/database/2", db.device.name);
    },
    test_fetch_commands: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchCommands();
            })
            .then(this.next_callback('check_fetch_commands'));
    },
    check_fetch_commands: function (commands) {
        this.assert(commands.length);
        var cmd0 = commands[0];
        this.assert(cmd0.Class);
        this.assert_equal(TestValues.tango_host + "/" + TestValues.test_device + "/CrashFromDevelopperThread", cmd0.id);
        this.assert_equal('CrashFromDevelopperThread', cmd0.name)
    },
    test_fetch_attrs: function () {
        var api = new TangoRestApi({url: TestValues.rest_url});
        api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttrs();
            })
            .then(this.next_callback('check_fetch_attrs'));
    },
    check_fetch_attrs: function (attrs) {
        var ampli = attrs[0];
        this.assert_equal("ampli", ampli.name);
        this.assert_equal(ampli.name, ampli.info.name);
    },
    async test_poll_status(){
        var api = new TangoRestApi({url: TestValues.rest_url});
        const device = await api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

        await device.fetchCommands();
        await device.fetchAttrs();
        device.pollStatus()
            .then(this.next_callback('check_poll_status'))
    },
    check_poll_status(polled){
        const pollable = polled.find(pollable => pollable.name === "double_scalar");
        this.assert(pollable.polled)
    }
});
var test = new MVC.Test.Unit('tango_rest_api', {
    test_create: function () {
        var one = new TangoRestApi({url: 'http://localhost:10001'});
        var two = new TangoRestApi({url: 'http://localhost:10002'});

        one.req_ids.push(1, 2, 3);
        this.assert_equal(0, two.req_ids.length);
    },
    test_load_host: function () {
        var one = new TangoRestApi({url: TestValues.rest_url});

        one.fetchHost(TestValues.tango_host).then(this.next_callback("check_load_host"))
    },
    check_load_host: function (resp) {
        this.assert_equal("sys/database/2", resp.name)
    },
    test_load_host_failed: function () {
        var one = new TangoRestApi({url: TestValues.rest_url});

        one.fetchHost("xxx:10000").fail(this.next_callback("check_load_host_failed"))
    },
    check_load_host_failed: function (resp) {
        this.assert_equal("unknown", resp.name)
    }
});
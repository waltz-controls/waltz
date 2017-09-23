var test = new MVC.Test.Unit('tango_rest_api', {
    test_create: function () {
        var one = new TangoRestApi({url: 'http://localhost:10001'});
        var two = new TangoRestApi({url: 'http://localhost:10002'});

        one.req_ids.push(1, 2, 3);
        this.assert_equal(0, two.req_ids.length);

        this.assert_not(one.value == two.value);

        two.value.add({id: 1});
        this.assert(two.value.exists(1));
        this.assert_not(one.value.exists(1));
    },
    test_send_event: function () {
        var one = new TangoRestApi({url: 'http://localhost:10001'});
        one.value.add({id: 1});

        one.setCursor(1)
    },
    test_load_host: function () {
        var one = new TangoRestApi({url: 'http://localhost:10001'});

        one.fetchHost("localhost", "10000").then(this.next_callback("check_load_host"))
    },
    check_load_host: function (resp) {
        this.assert_equal("sys/database/2", resp.name)
    }

});
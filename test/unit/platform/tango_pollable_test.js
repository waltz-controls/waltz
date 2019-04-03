/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/2/19
 */
new MVC.Test.Unit('tango_pollable', {
    async test_fetch_poll_status () {
        const api = new TangoRestApi({url: TestValues.rest_url});
        const device = await api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

        const pollable = new TangoAttribute({
            device_id : device.id,
            name: "long_scalar"
        });

        pollable.fetchPollingStatus()
            .then(this.next_callback("check_fetch"));
    },
    check_fetch: function (pollable) {
        this.assert(!pollable.polled);
    },
    async test_set_polling () {
        const api = new TangoRestApi({url: TestValues.rest_url});
        const device = await api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

        const pollable = new TangoAttribute({
            device_id : device.id,
            name: "long_scalar"
        });

        await pollable.fetchPollingStatus();
        pollable.updatePolling(true, 1000)
            .then(this.next_callback("check_set_polling"));
    },
    check_set_polling: function (pollable) {
        this.assert(pollable.polled);
        this.assert_equal(1000, pollable.poll_rate);
    },
    async test_update_polling () {
        const api = new TangoRestApi({url: TestValues.rest_url});
        const device = await api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

        const pollable = new TangoAttribute({
            device_id : device.id,
            name: "long_scalar"
        });

        await pollable.fetchPollingStatus();
        pollable.updatePolling(true, 10000)
            .then(this.next_callback("check_update_polling"));
    },
    check_update_polling: function (pollable) {
        this.assert(pollable.polled);
        this.assert_equal(10000, pollable.poll_rate);
    },
    async test_remove_polling () {
        const api = new TangoRestApi({url: TestValues.rest_url});
        const device = await api.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

        const pollable = new TangoAttribute({
            device_id : device.id,
            name: "long_scalar"
        });

        await pollable.fetchPollingStatus();
        pollable.updatePolling(false)
            .then(this.next_callback("check_remove_polling"));
    },
    check_remove_polling: function (pollable) {
        this.assert(!pollable.polled);
        this.assert_equal(undefined, pollable.poll_rate);
    }
});

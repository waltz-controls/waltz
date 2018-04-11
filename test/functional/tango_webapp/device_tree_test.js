new Test.Functional('test_device_tree', {
    test_open: function () {
        webix.ui({
            view: 'window',
            id: 'device-tree-test-window',
            height: 480,
            body: {
                view: 'device_tree',
                id: 'device-tree-test',
                context: PlatformContext
            }
        }).show();
    },
    test_bind_request: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(this.next_callback('bind_request'))
    },
    bind_request: function (device) {
        PlatformContext.devices.setCursor(device.id);
        // this.assert($$('device-panel-test').isEnabled());
        // this.assert_equal(30,$$('device-panel-test').$$('commands').$$('list').count());
    },
    test_bind_other: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice('sys/database/2');
            })
            .then(this.next_callback('bind_other'))
    },
    bind_other: function (device) {
        PlatformContext.devices.setCursor(device.id);
        // this.assert($$('device-panel-test').isEnabled());
        // this.assert_equal(100,$$('device-panel-test').$$('commands').$$('list').count());
    },
    test_close: function () {
        $$('device-tree-test-window').destructor();
        this.assert_not($$('device-tree-test-window'));
    }
});
new Test.Functional('test_device_panel', {
    test_open: function () {
        webix.ui({
            view: 'window',
            id: 'device-panel-test-window',
            height: 480,
            body: {
                view: 'device_control_panel',
                id: 'device_control_panel_test',
                context: PlatformContext
            }
        }).show();

        this.assert_not($$('device_control_panel_test').isEnabled());
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
        this.assert($$('device_control_panel_test').isEnabled());
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
        this.assert($$('device_control_panel_test').isEnabled());
        // this.assert_equal(100,$$('device-panel-test').$$('commands').$$('list').count());
    },
    test_close: function () {
        $$('device-panel-test-window').destructor();
        this.assert_not($$('device_control_panel_test'));
    }
});
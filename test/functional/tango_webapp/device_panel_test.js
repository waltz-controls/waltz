new Test.Functional('test_device_panel', {
    test_open: function () {
        webix.ui({
            view: 'window',
            id: 'device-panel-test-window',
            height: 480,
            body: {
                view: 'test_device_panel',
                id: 'device-panel-test',
                context: PlatformContext
            }
        }).show();

        this.assert_not($$('device-panel-test').isEnabled());
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
        this.assert($$('device-panel-test').isEnabled());
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
        this.assert($$('device-panel-test').isEnabled());
        // this.assert_equal(100,$$('device-panel-test').$$('commands').$$('list').count());
    },
    test_plot_open: function () {
        webix.ui({view: 'Plot', name: 'test', data: [1, 2, 3, 2, 5, 6, 1, 2, 8, 9, 3, 4, 5, 6]}).show();
        this.assert(true);
    },
    test_image_open: function () {
        //TODO
    },
    test_close: function () {
        $$('device-panel-test-window').destructor();
        this.assert_not($$('device-panel-test'));
    }
});
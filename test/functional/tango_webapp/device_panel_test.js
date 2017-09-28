new Test.Functional('test_device_panel', {
    test_open: function () {
        webix.ui({
            view: 'window',
            id: 'device-panel-test-window',
            body: {
                view: 'test_device_panel',
                id: 'device-panel-test',
                context: PlatformContext
            }
        }).show();

        this.assert_not($$('device-panel-test').isEnabled());
    },
    test_bind_request: function () {
        PlatformContext.rest.fetchHost('hzgxenvtest:10000')
            .then(function (host) {
                return host.fetchDevice('sys/tg_test/1');
            })
            .then(this.next_callback('bind_request'))
    },
    bind_request: function (device) {
        this.assert($$('device-panel-test').isEnabled())
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
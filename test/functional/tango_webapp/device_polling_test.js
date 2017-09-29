new Test.Functional('device_polling', {
    test_open: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                debugger
                webix.ui(
                    {
                        view: 'window',
                        id: 'polling_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newDevicePollingView(device)
                    }
                ).show();
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });
    },
    check_open: function () {
        this.assert($$('polling_window').isVisible());
    },

    test_close: function () {
        $$('polling_window').close();
    }
});
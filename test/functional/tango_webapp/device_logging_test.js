new Test.Functional('logging_window', {
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
                        id: 'logging_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newDeviceLoggingView(device)
                    }
                ).show();
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });


    },
    check_open: function () {
        this.assert($$('logging_window').isVisible());
    },
    test_close: function () {
        $$('logging_window').close();
    }
});
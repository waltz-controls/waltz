new Test.Functional('atk_panel',{
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
                        id: 'monitor_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newDeviceMonitorView({
                            device: device,
                            id: 'test/monitor/' + TestValues.test_device
                        })
                    }
                ).show();
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });


    },
    check_open: function () {
        this.assert($$('monitor_window').isVisible());
    },
    test_close: function () {
        $$('monitor_window').close();
    }
});
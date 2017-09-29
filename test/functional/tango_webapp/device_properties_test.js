new Test.Functional('device_properties', {
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
                        id: 'properties_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newDevicePropertiesView(device)
                    }
                ).show();
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });


    },
    check_open: function () {
        this.assert($$('properties_window').isVisible());
    },
    test_close: function () {
        $$('properties_window').close();
    }
});
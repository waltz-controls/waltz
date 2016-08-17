include('../mock_device');

new Test.Functional('device_properties', {
    test_open: function () {
        var device = new MockDevice(); //TODO mock


        webix.ui(
            {
                view      : 'window',
                id        : 'properties_window',
                move      : true,
                fullscreen: true,
                body      : TangoWebapp.newDeviceProperties(device)
            }
        ).show();
        this.assert($$('properties_window'));
    },

    test_close: function () {
        $$('properties_window').close();
    }
});
include('../mock_device');

new Test.Functional('logging_window', {
    test_open: function () {
        var device = new MockDevice(); //TODO mock


        webix.ui(
            {
                view      : 'window',
                id        : 'logging_window',
                move      : true,
                fullscreen: true,
                body      : TangoWebapp.newDeviceLogging(device)
            }
        ).show();
        this.assert($$('logging_window'));
    },

    test_close: function () {
        $$('logging_window').close();
    }
});
include('../mock_device');

new Test.Functional('device_polling', {
    test_start: function () {
        var device = new MockDevice(); //TODO mock


        webix.ui(
            {
                view      : 'window',
                id        : 'polling_window',
                move      : true,
                fullscreen: true,
                body      : TangoWebapp.newDevicePolling(device)
            }
        ).show();
        this.assert($$('polling_window'));
    },

    test_close: function () {
        $$('polling_window').close();
    }
});
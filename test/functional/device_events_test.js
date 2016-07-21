include('../mock_device');

new Test.Functional('events_window', {
    test_open: function () {
        var device = new MockDevice(); //TODO mock


        webix.ui(
            {
                view      : 'window',
                id        : 'events_window',
                move      : true,
                fullscreen: true,
                body      : TangoWebapp.newDeviceEvents(device)
            }
        ).show();
        this.assert($$('events_window'));
    },

    test_close: function () {
        $$('events_window').close();
    }
});
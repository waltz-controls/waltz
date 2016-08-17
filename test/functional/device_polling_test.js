include('../mock_device');

new Test.Functional('device_polling', {
    test_open: function () {
        //var device = new MockDevice(); //TODO mock
        var db = TangoWebapp.getDatabase();

        var device = new Device('sys/tg_test/1',db.id,db.api);

        webix.ui(
            {
                view      : 'window',
                id        : 'polling_window',
                move      : true,
                fullscreen: true,
                body      : TangoWebapp.ui.newDevicePolling(device)
            }
        ).show();
        this.assert($$('polling_window'));
    },

    test_close: function () {
        $$('polling_window').close();
    }
});
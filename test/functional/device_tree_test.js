new Test.Functional('device_tree', {
    test_open: function () {
        webix.ui(
            {
                view: 'window',
                move      : true,
                fullscreen: true,
                body: TangoWebapp.ui.newDeviceTree()
            }
        ).show();
    }
});
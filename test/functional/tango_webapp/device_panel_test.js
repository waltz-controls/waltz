new Test.Functional('test_device_panel', {
    test_open: function () {
        webix.ui({
            view: 'window',
            body: {
                view: 'test_device_panel',
                id: 'device-panel-test',
                context: PlatformTestContext
            }
        }).show();

        this.assert(true);
    },
    test_bind_request: function () {

    },
    test_plot_open: function () {
        webix.ui({view: 'Plot', name: 'test', data: [1, 2, 3, 2, 5, 6, 1, 2, 8, 9, 3, 4, 5, 6]}).show();
        this.assert(true);
    },
    test_image_open: function () {
        //TODO
    }
});
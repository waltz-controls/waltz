new Test.Functional('test_image_view', {
    test_plot_open: function () {
        var spectrum = {view: 'spectrum', name: 'test', value: [1, 2, 3, 2, 5, 6, 1, 2, 8, 9, 3, 4, 5, 6]};
        webix.ui({
            view: 'window',
            close: true,
            body: spectrum
        }).show();
        this.assert(true);
    },
    test_image_open: function () {
        var data = [];

        for (var i = 0; i < 8 * 8; ++i)
            data.push(Math.random())

        var image = {view: 'image', name: 'test', value: {data: data, width: 8, height: 8}};
        webix.ui({
            view: 'window',
            id: 'image-window',
            fullscreen: true,
            close: true,
            body: image
        }).show();
        this.assert(true);
    },
    test_image_close: function () {
        $$('image-window').close();
        this.assert(true);
    }
});
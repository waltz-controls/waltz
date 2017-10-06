new Test.Functional('test_image_view', {
    test_plot_open: function () {
        var spectrum = {view: 'spectrum', id: 'spectrum', name: 'test'};
        webix.ui({
            view: 'window',
            close: true,
            body: spectrum
        }).show();

        $$('spectrum').update([1, 2, 3, 2, 5, 6, 1, 2, 8, 9, 3, 4, 5, 6]);

        this.assert(true);
    },
    test_plot_text_open: function () {
        var spectrum = {view: 'spectrum_text', id: 'spectrum-text', name: 'test'};
        webix.ui({
            view: 'window',
            close: true,
            body: spectrum
        }).show();

        $$('spectrum-text').update(["text1", "text2", "text3", "text4"]);

        this.assert(true);
    },
    test_image_open: function () {
        var data = [];

        for (var i = 0; i < 8 * 8; ++i)
            data.push(Math.random())

        var image = {view: 'image', id: 'image', name: 'test'};
        webix.ui({
            view: 'window',
            id: 'image-window',
            fullscreen: true,
            close: true,
            body: image
        }).show();

        $$('image').update({data: data, width: 8, height: 8});

        this.assert(true);
    },
    test_image_close: function () {
        $$('image-window').close();
        this.assert(true);
    }
});
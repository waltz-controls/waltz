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
    },
    test_scalar_open:function(){
        webix.ui({
            view: 'window',
            id: 'scalar-window',
            fullscreen: true,
            close: true,
            body: {
                id: 'scalar-plot',
                view: 'scalar',
                empty: true
            }
        }).show();
    },
    test_scalar_add_traces:function(){
        var now = +new Date();
        $$('scalar-plot').addTrace("trace-1",[now - 1000],[1], 0);
        $$('scalar-plot').addTrace("trace-2",[now -  750],[2], 1);
        $$('scalar-plot').addTrace("trace-3",[now -  950],[3], 2);
    },
    test_scalar_update_traces:function(){
        var now = +new Date();
        $$('scalar-plot').updateTraces([0,1,2],[now, now, now],[3,1,2]);
    },
    test_scalar_delete_traces:function(){
        $$('scalar-plot').deleteTrace(1);
        var now = +new Date();
        $$('scalar-plot').updateTraces([0,1],[now, now],[1,2]);
    },
    test_scalar_close:function(){
        $$('scalar-window').close();
        this.assert(true);
    }
});
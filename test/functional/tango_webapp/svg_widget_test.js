/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/16/19
 */
new Test.Functional('svg_widget_test', {
    test_open: function () {
        webix.ui({
            view: 'window',
            id:"svg_window",
            close: true,
            fullscreen: true,
            body: TangoWebapp.ui.newSVGboard({
                id:"svg",
                svg: "SVG.svg"
            })
        }).show();
        this.check_open();
    },
    check_open: function () {
        this.assert($$('svg_window').isVisible());
    },
    test_close: function () {
        $$('svg_window').close();
    }
});

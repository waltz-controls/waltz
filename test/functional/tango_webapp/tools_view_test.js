/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/30/18
 */
new Test.Functional('tools_view_test', {
    test_open: function () {
        webix.ui({
            view: 'window',
            close: true,
            fullscreen: true,
            body: TangoWebapp.ui.newToolsView()
        }).show();

    }
});
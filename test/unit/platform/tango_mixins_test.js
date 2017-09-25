new MVC.Test.Unit('tango_mixins', {
    test_open_ajax_listener: function () {
        webix.protoUI({
            name: "open_ajax_listener_test"
        }, TangoWebapp.platform.webix.OpenAjaxListener, webix.ui.text);

        var self = this;
        var instance = webix.ui({
            view: 'open_ajax_listener_test',
            id: 'open_ajax_listener',
            on: {
                "test subscribe": function (data) {
                    self.assert_equal("Hi!", data.data);
                }
            }
        });

        OpenAjax.hub.publish("test", {data: "Hi!"});

        instance.destructor()
    }
});
new MVC.Test.Unit('tango_mixins', {
    test_open_ajax_listener: function () {
        webix.protoUI({
            name: "open_ajax_listener_test",
            defaults: {
                on: {
                    "test subscribe": function (data) {
                        self.assert_equal("Hi!", data.data);
                        self.assert_equal(instance, this);
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ui.text);

        var self = this;
        var instance = webix.ui({
            view: 'open_ajax_listener_test',
            id: 'open_ajax_listener'
        });

        OpenAjax.hub.publish("test", {data: "Hi!"});

        instance.destructor()
    }
});
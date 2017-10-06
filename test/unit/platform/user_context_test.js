new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        this.assert(UserContext === instance);
    },
    test_update: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        instance.update_attributes({
            tango_hosts: ["localhost:10001", "localhost:10002"]
        });

        instance.destroy();

        instance = TangoWebapp.platform.UserContext.find_one("test");
        this.assert_each(["localhost:10001", "localhost:10002"], instance.tango_hosts);
    },
    test_destroy: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        UserContext.destroy("test");
    }
});
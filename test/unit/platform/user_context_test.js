new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        this.assert_equal("test",instance.user);
    },
    test_update: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        instance.update_attributes({
            tango_hosts: {"localhost:10001": "", "localhost:10002": ""}
        });

        instance = TangoWebapp.platform.UserContext.find_one("test");
        for (var tango_host in instance.tango_hosts) {
            this.assert(["localhost:10001", "localhost:10002"].includes(tango_host));
        }

    },
    test_destroy: function () {
        var instance = TangoWebapp.platform.UserContext.find_one("test");

        instance.destroy();
    }
});
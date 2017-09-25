new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = UserContext.find_one("test");

        this.assert(UserContext.current === instance);
    },
    test_update: function () {
        var instance = UserContext.find_one("test");

        instance.update_attributes({
            tango_hosts: ["localhost:10001", "localhost:10002"]
        });

        instance.destroy();

        instance = UserContext.find_one("test");
        this.assert_each(["localhost:10001", "localhost:10002"], instance.tango_hosts);
    },
    test_destroy: function () {
        var instance = UserContext.find_one("test");

        UserContext.destroy("test");
    }
});
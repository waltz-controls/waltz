new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = UserContext.find_one("test");

        this.assert_not(instance.rest == null);

        this.assert(UserContext.current === instance);
        this.assert(instance.rest === UserContext.find_one("test").rest);
    },
    test_update: function () {
        var instance = UserContext.find_one("test");

        instance.tango_hosts = ["localhost:10001", "localhost:10002"];
        instance.update();

        instance.destroy();

        instance = UserContext.find_one("test");
        this.assert_each(["localhost:10001", "localhost:10002"], instance.tango_hosts);
    },
    test_destroy: function () {
        var instance = UserContext.find_one("test");

        UserContext.destroy("test");
    }
});
new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = UserContext.find_one("test");

        this.assert_not(instance.rest == null);

        this.assert(UserContext.instance === instance);
        this.assert(instance.rest, UserContext.find_one("test").rest);
    },
    test_destroy: function () {
        var instance = UserContext.find_one("test");

        UserContext.destroy("test");
    }
});
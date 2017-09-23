new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = UserContext.find_one("test");

        this.assert(instance.rest == null);
        instance.rest = new TangoRestApi({url: instance.rest_url});

        this.assert(UserContext.instance === instance);
    },
    test_destroy: function () {
        var instance = UserContext.find_one("test");

        UserContext.destroy("test");
    }
});
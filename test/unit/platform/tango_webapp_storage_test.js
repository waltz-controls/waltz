new MVC.Test.Unit('tango_webapp_storage', {
    test_create: function () {
        var instance = new TangoWebappStorage("test");

        instance.create({
            Class: {
                id: "id"
            },
            id: 1,
            value: "some"
        });

        this.assert_equal("some", instance.find_one(1).value);
        this.assert_equal(null, instance.find_one(2));
    }
});
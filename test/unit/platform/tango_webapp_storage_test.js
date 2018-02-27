new MVC.Test.Unit('tango_webapp_storage', {
    test_create: function () {
        var Item = MVC.Model.extend('item', {
            attributes: {
                id: 'number',
                value: 'string'
            },
            default_attributes: {}
        }, {

        });

        var instance = new TangoWebappStorage(Item);

        instance.create(new Item({id: 1, value: 'some'}));

        this.assert_equal("some", instance.find_one(1).value);
        this.assert_equal(null, instance.find_one(2));
    },
    test_remote: function(){
        var instance = new TangoRemoteStorage();
        var result = instance.find_one("test-remote");

        instance.update("test-remote", {id:"test-remote", foo: 'bar'});

        var result = instance.find_one("test-remote");
        this.assert_equal("bar", result.foo);

        instance.destroy("test-remote");

        var result = instance.find_one("test-remote");
        this.assert_null(result);
    }
});
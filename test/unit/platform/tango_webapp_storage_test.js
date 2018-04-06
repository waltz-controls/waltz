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
    },
    test_webix_data_collection:function(){
        var Item = MVC.Model.extend("item",{
            store_type: WebixDataCollectionStorage,
            attributes: {
                id: 'string',
                name: 'string'
            }
        },{

        });

        var item1 = Item.create_as_existing({id:1, name:'item 1'});

        this.assert_not(Item.store.is_empty());
        this.assert(item1 === Item.find_one(item1.id));

        var item2 = new Item({id: 2, name:'item 2'});
        this.assert(item2 === Item.find_one(item2.id));

        item1.update_attributes({
            name: 'new item 1 name'
        });

        this.assert_equal('new item 1 name', Item.find_one(item1.id).name);

        item1.destroy();
        this.assert_null(Item.find_one(item1.id));
        this.assert_equal(1, Item.find_all().length);
    }
});
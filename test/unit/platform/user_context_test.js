new MVC.Test.Unit('user_context', {
    test_create: function () {
        var instance = TangoWebappPlatform.UserContext.find_one("test");

        this.assert_equal("test",instance.user);
    },
    test_update: function () {
        var instance = TangoWebappPlatform.UserContext.find_one("test");

        instance.update_attributes({
            tango_hosts: {"localhost:10001": "", "localhost:10002": ""}
        });

        instance = TangoWebappPlatform.UserContext.find_one("test");
        for (var tango_host in instance.tango_hosts) {
            this.assert(["localhost:10001", "localhost:10002"].includes(tango_host));
        }

    },
    test_destroy: function () {
        var instance = TangoWebappPlatform.UserContext.find_one("test");

        instance.destroy();
    },
    test_user_context_store_simple:function(){
        var Item = MVC.Model.extend('test_item',{
            attributes:{},
            default_attributes:{}
        },{});

        var store = new TangoWebappPlatform.UserContextStore(Item);
        var context = TangoWebappPlatform.UserContext.create_as_existing({
            user: "test_1",
            tango_hosts: TestValues.tango_host,
            device_filters: ['*/*/*'],
            ext: Object.create(null)
        });

        this.assert(store.context === context);
    },
    test_user_context_store_complex:function(){
        var Item1 = MVC.Model.extend('test_item1',{
            attributes:{},
            default_attributes:{}
        },{});

        var Item2 = MVC.Model.extend('test_item2',{
            attributes:{},
            default_attributes:{}
        },{});

        var store1 = new TangoWebappPlatform.UserContextStore(Item1);
        var context1 = TangoWebappPlatform.UserContext.create_as_existing({
            user: "test_1",
            tango_hosts: TestValues.tango_host,
            device_filters: ['*/*/*'],
            ext: Object.create(null)
        });

        var store2 = new TangoWebappPlatform.UserContextStore(Item2);
        var context2 = TangoWebappPlatform.UserContext.create_as_existing({
            user: "test_2",
            tango_hosts: TestValues.tango_host,
            device_filters: ['*/*/*'],
            ext: Object.create(null)
        });

        this.assert(store1.context === context2);
        this.assert(store2.context === context2);

        context1.destroy();

        this.assert(store1.context === context2);
        this.assert(store2.context === context2);

        context2.destroy();
        this.assert_null(store1.context);
        this.assert_null(store2.context);
    },
    test_widget_state:function(){
        var state = new TangoWebappPlatform.WidgetState({
            id:'test_widget_state'
        });

        state.setState(["1", "2", "3"]);

        this.assert_each(["1", "2", "3"], state.Class.store.context.ext['test_widget_state'].data);
        this.assert_each(["1", "2", "3"], state.getState());
    },
    test_widget_state_non_existing:function(){
        var state = TangoWebappPlatform.WidgetState.find_one(Math.random());

        this.assert_null(state);
    }
});
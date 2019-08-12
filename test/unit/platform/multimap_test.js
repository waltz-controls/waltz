// import MultiMap from "../../../resources/platform/multimap.js";

include("../../../resources/platform/multimap.js");

new MVC.Test.Unit('multimap', {
    test_put: function () {
        const instance = new MultiMap();

        instance.put(1,"Hello");


        this.assert(instance.get(1).length === 1);
        this.assert_equal("Hello", instance.get(1)[0]);
    },

    test_remove: function () {
        const instance = new MultiMap();

        instance.put(1,"Hello");
        instance.put(1,"World");


        this.assert(instance.get(1).length === 2);


        instance.remove(1, "Hello");


        this.assert(instance.get(1).length === 1);
        this.assert_equal("World", instance.get(1)[0]);
    },

    test_removeAll: function () {
        const instance = new MultiMap();

        instance.put(1,"Hello");
        instance.put(1,"World");


        this.assert(instance.get(1).length === 2);


        instance.removeAll(1);


        this.assert(instance.get(1).length === 0);
    }
});
new MVC.Test.Unit('device_filter', {
    test_create: function () {
        var instance = new DeviceFilter({
            value: ["sys/*/0", "test/rest/*"]
        });

        this.assert_each(["sys*", "test*"], instance.domain_filter);
        this.assert_each(["sys/*", "test/rest"], instance.family_filter);
        this.assert_each(["sys/*/0", "test/rest/*"], instance.member_filter);
    },
    test_update: function () {
        var instance = new DeviceFilter({
            value: ["*/*/*"]
        });

        instance = new DeviceFilter({
            value: ["some/test/0"]
        });

        this.assert_each(["some*"], instance.domain_filter);
        this.assert_each(["some/test"], instance.family_filter);
        this.assert_each(["some/test/0"], instance.member_filter);
    },
    test_getFamilyFilters:function () {
        var instance = new DeviceFilter({
            value: ["sys/tg_test/0","sys/tg_test/1","some/*/*"]
        });

        this.assert_each(["sys/tg_test*", "sys/tg_test*"], instance.getFamilyFilters("sys"));

        instance = new DeviceFilter({
            value: ["sys/tg_test/0","sys/tg_test/1","*/*/*"]
        });

        this.assert_each(["some/*"], instance.getFamilyFilters("some"));
    },
    test_getMemberFilters:function () {
        var instance = new DeviceFilter({
            value: ["sys/tg_test/0","sys/tg_test/1","some/*/*"]
        });

        this.assert_each(["sys/tg_test/0", "sys/tg_test/1"], instance.getMemberFilters("sys","tg_test"));
        this.assert_each(["some/tg_test/*"], instance.getMemberFilters("some","tg_test"));
    }
});
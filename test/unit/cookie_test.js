new MVC.Test.Unit('cookie',{
    test_rest_host: function() {
        var host = RestApiHost.create(
            {
                host: "testhost",
                port: 666,
                version: "rc3"
            }
        );

        var saved = RestApiHost.find_all();

        this.assert_not_null(saved[0], "saved instance should not be null.");
    },
    test_load_from_cookie: function(){
        var saved = RestApiHost.find_all();

        this.assert_not_null(saved[0], "saved instance should not be null.");
    }
});
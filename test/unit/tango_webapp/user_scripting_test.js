new MVC.Test.Unit('user_scripting', {
    test_create: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'return 2 + 2;'
        });

        
    },
    test_update: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'return 2 + 3;'
        });
    },
    test_execute: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'return 2 + 3;'
        });

        instance.execute().then(this.next_callback('success'));

    },
    success:function(res){
        this.assert_equal(5, res);
    },
    test_execute_failed: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'return PlatformContext.rest.fetchHost()'//window is undefined -> ReferenceError
        });

        instance.execute().fail(this.next_callback('failure'));
    },
    /**
     *
     * @param {UserScript} script
     */
    failure:function(script){
        this.assert_equal('host is undefined', script.errors[0].message);
    },
    test_execute_ajax: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'return PlatformContext.rest.fetchHost("'+TestValues.tango_host+'")'
        });

        instance.execute().then(this.next_callback('success_ajax'))
            .fail(function(){debugger});
    },
    /**
     *
     * @param {TangoHost} host
     */
    success_ajax:function(host){
        this.assert_equal(TestValues.tango_host, host.id)
    }
});
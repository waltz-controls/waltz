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
    success:function(result){
        this.assert_equal(5, result);
    },
    test_execute_failed: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'window.alert("Ouch!");'//window is undefined -> ReferenceError
        });

        instance.execute().fail(this.next_callback('failure'));


    },
    failure:function(err){
        this.assert(err === 'ReferenceError: window is not defined');
    },
    test_execute_ajax: function () {
        var instance = new UserScript({
            name: 'test_script',
            code: 'PlatformContext.rest.fetchTangoHost()'
        });

        instance.execute().then(this.next_callback('success_ajax'));


    },
    success_ajax:function(resp){
        resp.then(function (value) { debugger })
    }
});
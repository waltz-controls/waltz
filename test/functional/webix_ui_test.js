new Test.Functional('webix_ui',{
    test_log_open: function() {
        webix.ui({
            view: 'popup',
            id:'logger',
            minHeight:320,
            height:640,
            minWidth:320,
            width:480,
            body: {
                view: 'Logger',
                id: 'main-log',
                ejs: 'views/main_log_item.ejs'
            }
        }).show();
    },
    test_log:function(){
        TangoWebappPlatform.log('Here is the log message');
    },
    test_error:function(){
        TangoWebappPlatform.error('Here is the error message');
    },
    test_error_long:function(){
        TangoWebappPlatform.error('Here is the error message with very very very long content\n\t possibly with line breaks\n\n\t\t\t\t etc...');
    },
    test_log_close: function(){
        $$('logger').close();
    }
});
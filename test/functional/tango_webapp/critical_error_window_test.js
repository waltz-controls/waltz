new Test.Functional('critical_error_window',{
    test_open: function () {
                debugger

        var invalidRest = new TangoWebappPlatform.TangoRestApi({
            url: 'xxx'
        });

                webix.ui(
                    TangoWebapp.ui.newCriticalErrorWindow(invalidRest)
                    ).show();

    },
    check_open: function () {
        this.assert($$('critical_error_no_rest').isVisible());
    },
    test_close:function(){
        $$('critical_error_no_rest').close()
    }
});
new Test.Functional('atk_panel',{
    test_open: function() {
        TangoWebapp.helpers.openAtkTab(new Device('sys/tg_test/1',"",new TangoREST("http://localhost:8080/localhost/rest/rc2")));

        this.assert(true);
    }
});
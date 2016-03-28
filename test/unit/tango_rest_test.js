new MVC.Test.Unit('tango_rest',{
   test_get_fail: function() {
       var rest = new TangoREST("http://localhost:8080/hzgxenvtest.desy.de/rest/rc2");
       rest.devices("sys/tg_test/xxx").get().fail(this.next_callback("get_fail_pass"));
   },
    get_fail_pass: function(resp){
        this.assert(true);
    }
});
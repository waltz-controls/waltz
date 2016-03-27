new MVC.Test.Unit('test_device',{
   test_create: function() {
      var result = new Device({url:'',name:"test/tango/0"});
      this.assert_equal("test/tango/0",result.name);
   },
   test_info:function(){
      var device = new Device({url:"http://localhost:8080/localhost/rest/rc2", name:"sys/tg_test/1"});

      device.info();//fetches data
      device.info().then(this.next_callback("info_success"));
   },
   info_success:function(resp){
      this.assert_equal("sys/tg_test/1", resp.name);
   },
   test_state:function(){
      var device = new Device({url:"http://localhost:8080/localhost/rest/rc2", name:"sys/tg_test/1"});

      device.state().then(this.next_callback("state_success"));
   },
   state_success:function(resp){
      this.assert_equal("RUNNING", resp.state);
   },
   test_state_fail:function(){
      var device = new Device({url:"http://localhost:8080/localhost/rest/rc2", name:"sys/tg_test/xxx"}); //NON EXISTING DEVICE

      device.state().then(this.next_callback("state_fail"));
   },
   state_fail:function(resp){
      this.assert_equal("FAILURE", resp.quality);
   }

});
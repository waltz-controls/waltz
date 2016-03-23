new MVC.Test.Unit('test_device',{
   test_create: function() {
      var result = new Device({url:"test/tango/0"});
      this.assert_equal("test/tango/0",result.url);
   },
   test_info:function(){
      var device = new Device({url:"http://localhost:8080/localhost/rest/rc2/devices/sys/tg_test/1"});

      device.info(this.next_callback("info_success"));
   },
   info_success:function(resp){
      this.assert(true);
   }
});
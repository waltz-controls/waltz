new MVC.Test.Unit('test_database',{
   test_DbGetDeviceInfo: function() {
      var db = new DataBase('sys/database/2');

      var respone = db.DbGetDeviceInfo('sys/tg_test/1');


      respone.then(this.next_callback('assert_DbGetDeviceInfo'));

   },
   assert_DbGetDeviceInfo: function(response){
      this.assert(response.output.svalue[0] == 'sys/tg_test/1');
   }
});
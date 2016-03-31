new Test.Functional('plot',{
   test_open: function() {
      webix.ui({view:'Plot', name:'test',data: [1,2,3,2,5,6,1,2,8,9,3,4,5,6]}).show();
      this.assert(true);
   }
});
new Test.Functional('test_my_dashboard',{
   test_truth: function() {
       var dashboard = {view: 'my_dashboard', id: 'my_dashboard_test'};
       webix.ui({
           view: 'window',
           close: true,
           width: 800,
           height:600,
           body: dashboard
       }).show();



       this.assert(true);
   }
});
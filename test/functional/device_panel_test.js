new Test.Functional('device_panel',{
   test_open: function() {
      webix.debug_bind = true;

      TangoWebapp.openDevicePanel(new Device('sys/tg_test/1'));

      this.assert(true);
   }
});
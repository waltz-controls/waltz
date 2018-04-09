new Test.Functional('attr_conf_window', {
    test_open: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                webix.ui(
                    {
                        view: 'window',
                        id: 'attr_conf_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newDeviceAttrConfigView(device)
                    }
                    ).show();

                webix.ui(
                    {
                        view: 'window',
                        id: 'attr_window',
                        move: true,
                        body: {
                            view: 'datatable',
                            id: 'attr_info_datatable',
                            columns: [
                                    {id: 'attr.name', template:function(obj){
                                            return obj.attr.name;
                                        }},
                                    {id: 'label'},
                                    {id: 'alarms.max_alarm', template:function(obj){
                                            return obj.alarms.max_alarm;
                                        }}
                            ]
                        }
                    }
                    ).show();

                 $$('attr_info_datatable').data.sync(TangoAttributeInfo.store._data);
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });
    },
    check_open: function () {
        this.assert($$('attr_conf_window').isVisible());
    },
    test_close: function () {
        $$('attr_conf_window').close();
    }
});
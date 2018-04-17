new Test.Functional('attrs_panel',{
    test_open: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                debugger

                webix.ui(
                    {
                        view: 'window',
                        id: 'monitor_window',
                        move: true,
                        fullscreen: true,
                        body: TangoWebapp.ui.newStatefulAttrsMonitorView({
                            id: 'test/attrs_monitor/' + TestValues.test_device
                        })
                    }
                    ).show();
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });


    },
    check_open: function () {
        this.assert($$('monitor_window').isVisible());
    },
    test_add_scalar: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('long_scalar');
            }).then(function(attr){
            $$('test/attrs_monitor/' + TestValues.test_device).addAttribute(attr);
        });
    },
    test_add_another_scalar: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('double_scalar');
            }).then(function(attr){
            $$('test/attrs_monitor/' + TestValues.test_device).addAttribute(attr);
        });
    },
    test_add_yet_another_scalar: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.database);
            })
            .then(function (device) {
                return device.fetchAttr('StoredProcedureRelease');
            }).then(function(attr){
            $$('test/attrs_monitor/' + TestValues.test_device).addAttribute(attr);
        });
    },
    test_add_image: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('ushort_image_ro');
            }).then(function(attr){
            $$('test/attrs_monitor/' + TestValues.test_device).addAttribute(attr);
        });

    },
    test_add_spectrum: function () {
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('double_spectrum_ro');
            }).then(function(attr){
            $$('test/attrs_monitor/' + TestValues.test_device).addAttribute(attr);
        });

    },
    test_add_failed: function () {
        $$('test/attrs_monitor/' + TestValues.test_device).$$('scalars').addAttribute({
            info: {
                data_format: 'SPECTRUM'
            }
        });
    },
    test_start: function () {
        $$('test/attrs_monitor/' + TestValues.test_device).start();
    },
    test_stop: function () {
        $$('test/attrs_monitor/' + TestValues.test_device).stop();
    },
    test_close: function () {
        $$('monitor_window').destructor();
    }
});
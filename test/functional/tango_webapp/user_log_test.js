new Test.Functional('user_action_test', {
    test_open: function () {
        webix.ui({
            view: 'window',
            close: true,
            height: 768,
            width: 480,
            body: {
                rows: [
                    {
                        id: 'test-log',
                        view: 'logger'
                    }
                ]
            }
        }).show();

        this.assert($$('test-log'));
        TangoWebapp.UserActionController.logger = $$('test-log');
    },
    test_read_attribute_action:function(){
        var attr = new TangoAttribute({
            id: 'test-attr',
            device_id: undefined,
            info: {}
        });

        var action = TangoWebapp.UserAction.readAttribute(attr);

        this.assert_equal(1, $$('test-log').count());
    },
    test_real_read_attribute_action:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('long_scalar');
            })
            .then(function (attr) {
                return TangoWebapp.UserAction.readAttribute(attr);
            })
            .then(this.next_callback('read_attribute_action'))
    },
    read_attribute_action:function(){
        debugger
    },
    test_real_write_attribute_action:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('long_scalar_w');
            })
            .then(function (attr) {
                return TangoWebapp.UserAction.writeAttribute(attr, 1234);
            })
            .then(this.next_callback('write_attribute_action'))
    },
    write_attribute_action:function(){
        debugger
    },
    test_real_write_attribute_action_failed:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttr('long_scalar_w');
            })
            .then(function (attr) {
                return TangoWebapp.UserAction.writeAttribute(attr, "invalid argument");
            })
    },
    test_write_non_existing_attribute:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return new TangoAttribute({
                    id: 'ouch',
                    name: 'xxx',
                    device_id: device.id,
                    info: {
                        data_format: 'SPECTRUM'
                    }
                })
            })
            .then(function (attr) {
                return TangoWebapp.UserAction.writeAttribute(attr, 1234);
            })
            .then(this.next_callback('write_attribute_action'))
            .fail(function(){
                debugger
            })
    },
    test_execute_command:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchCommand('DevDouble');
            })
            .then(function (cmd) {
                return TangoWebapp.UserAction.executeCommand(cmd, 3.14);
            })
            .then(this.next_callback('write_attribute_action'))
            .fail(function(){
                debugger
            })
    },
    test_read_write_device_properties:function(){
        var device = PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            });

            device.then(function (device) {
                return TangoWebapp.UserAction.readDeviceProperties(device);
            })
            .then(this.next_callback('write_attribute_action'))
            .fail(function(){
                debugger
            })

        device
            .then(function (device) {
                return TangoWebapp.UserAction.writeDeviceProperties(device, {
                    my_new_prop: [1234]
                });
            })
            .then(this.next_callback('write_attribute_action'))
            .fail(function(){
                debugger
            })
    },
    test_read_write_pipe:function(){
        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchPipe('string_long_short_ro');
            })
            .then(function (pipe) {
                return TangoWebapp.UserAction.readPipe(pipe);
            })
            .then(function (pipe) {
                return TangoWebapp.UserAction.writePipe(pipe, {
                    name:pipe.name,
                    data:[
                        {
                            name:"FirstDE",
                            type: "DevString",
                            value:["Hello Tango!"]
                        },
                        {
                            name:"SecondDE",
                            type:"DevLong",
                            value:[123]
                        },
                        {
                            name:"ThirdDE",
                            type:"DevShort",
                            value:[42]
                }
            ]
            });
            })
            .then(this.next_callback('write_attribute_action'))
            .fail(function(){
                debugger
            })
    }
});
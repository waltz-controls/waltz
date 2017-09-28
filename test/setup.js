MVC.Console.log("Trying to load: test/setup.js");

//TODO use everywhere
TestValues = {
    rest_url: 'http://localhost:10001',
    tango_host: 'localhost:10000',
    test_device: 'sys/tg_test/1'
};

PlatformContext = (function () {
    tango_hosts = {};
    tango_hosts[TestValues.tango_host] = '';

    return new TangoWebapp.platform.PlatformContext({
        user_context: new TangoWebapp.platform.UserContext({
            user: 'test',
            tango_hosts: tango_hosts,
            device_filters: ['*/*/*']
        })
    })
})();

PlatformContext.rest = new TangoRestApi({url: TestValues.rest_url});
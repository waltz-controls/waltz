MVC.Console.log("Trying to load: test/setup.js");

//TODO use everywhere
TestValues = {
    rest_url: 'http://localhost:10001',
    tango_host: 'localhost:10000',
    test_device: 'sys/tg_test/1',
    database: 'sys/database/2'
};

PlatformContext = (function () {
    tango_hosts = {};
    tango_hosts[TestValues.tango_host] = '';

    return new TangoWebappPlatform.PlatformContext({
        //TODO this is overrided by the app when loaded prevent it
        UserContext: new TangoWebappPlatform.UserContext({
            user: 'test',
            tango_hosts: tango_hosts,
            device_filters: ['*/*/*']
        })
    })
})();

PlatformContext.rest = new TangoRestApi({url: TestValues.rest_url});

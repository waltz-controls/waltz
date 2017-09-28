MVC.Console.log("Trying to load: test/setup.js");

PlatformContext = new TangoWebapp.platform.PlatformContext({
    user_context: new TangoWebapp.platform.UserContext({
        user: 'test',
        tango_hosts: {
            'localhost:10000': ''
        },
        device_filters: ['*/*/*']
    })
});

PlatformContext.rest = new TangoRestApi({url: 'http://localhost:10001'});
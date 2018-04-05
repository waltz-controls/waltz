include.unit_tests(
    'tango_webapp/device_filter'
    // 'test_database',
    // 'test_device',
    // 'tango_rest',
    // 'cookie'
);

include('../../test/setup');

include.functional_tests(
    'tango_webapp/image_view',
    'tango_webapp/device_panel',
    'tango_webapp/device_properties',
    'tango_webapp/device_polling',
    'tango_webapp/device_events',
    'tango_webapp/device_attr_config',
    'tango_webapp/device_logging',
    'tango_webapp/device_monitor',
    'tango_webapp/sync_device_attrs'

    // 'device_tree',
    // 'webix_ui'
);


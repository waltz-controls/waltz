include.unit_tests(
    'tango_webapp/device_filter',
    'test_database',
    'test_device',
    'tango_rest',
    'cookie'
);
include.functional_tests(
    'atk_panel',
    'device_panel',
    'device_properties',
    'device_polling',
    'device_events',
    'device_logging',
    'device_tree',
    'webix_ui'
);

webix.debug_bind = true;
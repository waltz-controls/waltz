include.unit_tests(
    'test_database',
    'test_device',
    'tango_rest'
);
include.functional_tests(
    'atk_panel',
    'device_panel',
    'device_properties',
    'device_polling',
    'device_events',
    'device_logging'
);

webix.debug_bind = true;
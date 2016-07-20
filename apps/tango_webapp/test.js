include.unit_tests(
    'test_database',
    'test_device',
    'tango_rest'
);
include.functional_tests(
    'device_panel',
    'device_properties',
    'device_polling'
);

webix.debug_bind = true;
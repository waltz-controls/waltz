include("platform");

include.application('TangoWebapp', '0.2-rc3');

/**
 * Useful (or not) constants
 *
 * @type {{REST_API_HOST: string, REST_API_PORT: number, REST_API_VERSION: string, TANGO_HOST: string, TANGO_PORT: number, NAME_COLUMN_WIDTH: number, TABS_DELIMITER_HEIGHT: number, DATABASE: string, LOG_DATE_FORMATTER: TangoWebapp.consts.LOG_DATE_FORMATTER}}
 */
TangoWebapp.consts = {
    REST_API_HOST: 'localhost',
    REST_API_PORT: 10001,
    REST_API_VERSION: 'rc4',
    TANGO_HOST: 'localhost',
    TANGO_PORT: 10000,
    NAME_COLUMN_WIDTH: 250,
    TABS_DELIMITER_HEIGHT: 3,
    PLOTLY_SCALE_THRESHOLD: 256,
    DATABASE: 'sys/database/2',
    LOG_DATE_FORMATTER: function (date) {
        return date;
    }
};

include.css(
    "highlight"
    // "webix/codebase/skins/aircompact"
);
include.libs(
    //"webix/codebase/webix_debug"
);
include.resources(
);
include.engines(
);
include.plugins(
);

include(function () { //runs after prior includes are loaded
    include.models(
        // "data_base_device", "device", "dserver", "rest_api", "tango_host", "globals", "credentials",
        "tango_webapp/device_filter"
    );
    include.controllers(
        "tango_webapp/main"
    );
    include.views(
        "views/main_log_item", "views/getting_started",
        "views/device_info", "views/dev_panel_command_out", "views/dev_panel_attribute_info", "views/dev_panel_attribute_out", "views/dev_panel_pipe_out"
    );
    include.resources(
        "tango_webapp/setup"
    );
});
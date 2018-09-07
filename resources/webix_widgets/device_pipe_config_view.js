/** @module DevicePipeConfigView
 *  @memberof ui
 */
(function () {
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.DevicePipeConfigView
     */
    var device_pipe_config_view = webix.protoUI(
        /** @lends  device_pipe_config_view */
        {
            name: "Device Pipe Config"
        }, webix.IdSpace, TangoWebappPlatform.mixin.TabActivator, webix.ui.layout);

    /**
     * @function
     * @memberof ui.DevicePipeConfigView
     */
    TangoWebapp.ui.newDevicePipeConf = function () {
        return {
            view: "Device Pipe Config",
            id: "device_pipe_config",
            rows: [
                {
                    height: 5
                },
                {
                    view: "tabview",
                    cells: [
                        {
                            header: "Label",
                            body: {
                                id: "label",
                                view: "datatable",
                                columns: [
                                    {header: "Pipe name"},
                                    {header: "Label"}
                                ]

                            }
                        },
                        {
                            header: "Description",
                            body: {
                                id: "description",
                                view: "datatable",
                                columns: [
                                    {header: "Pipe name"},
                                    {header: "Description"}
                                ]

                            }
                        },
                        {
                            header: "Settings",
                            body: {
                                id: "settings",
                                view: "datatable",
                                columns: [
                                    {header: "Parameters name"},
                                    {header: "Value"}
                                ]

                            }
                        }
                    ]
                },

                {
                    view: "toolbar",
                    cols: [
                        {view: "button", id: "btnRefresh", value: "Refresh", width: 100, align: "left"},
                        {view: "button", id: "btnApply", value: "Apply", width: 100, align: "left"}
                    ]
                }

            ]

        }
    };
})();
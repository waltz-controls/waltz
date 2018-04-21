/**
 * @module TangoHostView
 */
(function () {
    /**
     *
     * @param tango_host
     * @param tab
     * @returns {{header: string, body: {id: string, view: string, cells: *[]}}}
     */
    TangoWebapp.ui.newTangoHostTab = function (tango_host, tab) {
        return {
            header: '<span class="webix_icon fa-database"></span> [' + tango_host.id + ']',
            body: {
                id: 'view/' + tango_host.id,
                view: 'tabview',
                tabbar: {
                    on: {
                        "onBeforeTabClose": function () {
                            if (this.data.options.length === 1)
                                PlatformApi.PlatformUIController().closeTangoHostTab(tango_host);
                        }
                    }
                },
                cells: [tab]
            }
        };
    }
})();
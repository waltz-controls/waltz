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
                    tabMinWidth: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
                    on: {
                        "onItemClick":function(){
                            var id = this.getParentView().getValue().split('/');
                            id.shift();//remove prefix (view/ or monitor/)
                            id = id.join('/');
                            PlatformContext.devices.setCursor(id);
                        },
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
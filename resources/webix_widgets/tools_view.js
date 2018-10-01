/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 5/1/18
 */
(function () {
    TangoWebapp.ui.newToolsView = function () {
        return {
            view: 'tabview',
            cells: [
                {
                    header: "<span class='webix_icon fa-pencil-square-o'></span> Scripting",
                    body: TangoWebapp.ui.newStatefulScriptingConsoleView({id: 'scripting_console'})
                },
                {
                    header: "<span class='webix_icon fa-terminal'></span> Terminal",
                    body: TangoWebapp.ui.newTerminalView({id: 'terminal'})
                },
                {
                    header: "<span class='webix_icon fa-gears'></span> Settings",
                    body: {
                        id: 'settings',
                        view: "settings"
                    }
                }
            ]
        }
    };
})();
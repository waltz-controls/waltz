/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 5/1/18
 */
(function(){
    TangoWebapp.ui.newTerminalView = function(config){
        return webix.extend({
            view: 'iframe',
            src: TangoWebappPlatform.consts.TERMINAL_URL
        }, config)
    };

    TangoWebapp.ui.newTerminalViewTab = function(){
        return {
            header: "<span class='webix_icon mdi mdi-console-line'></span> Terminal",
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newTerminalView({id: 'terminal'})
        }
    }
})();

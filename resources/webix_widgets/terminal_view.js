/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 5/1/18
 */
(function(){
    TangoWebapp.ui.newTerminalView = function(config){
        return webix.extend({
            view: 'iframe',
            src: 'http://ec2-35-156-104-8.eu-central-1.compute.amazonaws.com:8010/index.html'
        }, config)
    }
})();

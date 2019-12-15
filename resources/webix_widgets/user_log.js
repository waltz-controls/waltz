/**
 *
 * @module UserLog
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
(function(){
    /**
     * @param {PlatformContext} context
     * @memberof ui.UserLog
     */
    TangoWebapp.ui.newUserLogPanel = function(context){
        return {
            header: "<span class='webix_icon mdi mdi-comment-text-outline'></span>",
            width: 300,
            collapsed: false,
            body: {
                context: context,
                view: 'logger',
                id: 'user-log'
            }
        };
    }
})();

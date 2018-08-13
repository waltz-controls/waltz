/**
 * Model platform_api
 * @class
 * @type id
 * @property {string} name
 * @property {UIBuilder} ui_builder
 * @property {PlatformContext} context
 * @extends MVC.Model
 */
TangoWebappPlatform.PlatformApi = MVC.Model.extend('platform_api',
    /** @lends  TangoWebappPlatform.PlatformApi */
    {
        associations:{
            has: ['UIBuilder']
        },
        attributes: {
            id:'string',
            ui_builder: 'UIBuilder',
            context: 'PlatformContext'
        },
        default_attributes: {
            id:'singleton'
        }
    },
    /** @lends  TangoWebappPlatform.PlatformApi.prototype */
    {
        /**
         * @return {UserContext}
         */
        user_context:function(){
            return this.context.UserContext;
        },
        /**
         * @return {UserContextController}
         */
        UserContextController:function(){
            return new TangoWebappPlatform.UserContextController(this.user_context());
        },
        /**
         */
        PlatformUIController:function(){
            return new TangoWebappPlatform.UIController();
        }
    });
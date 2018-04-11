/**
 * Model platform_api
 *
 * @type {PlatformApi}
 */
TangoWebappPlatform.PlatformApi = MVC.Model.extend('platform_api',
    /* @Static */
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
    /* @Prototype */
    {
        /**
         *
         * @return {UserContext}
         */
        user_context:function(){
            return this.context.UserContext;
        },
        /**
         *
         * @return {UserContextController}
         */
        UserContextController:function(){
            return new TangoWebappPlatform.UserContextController(this.user_context());
        },
        PlatformUIController:function(){
            return new TangoWebappPlatform.UIController();
        }
    });
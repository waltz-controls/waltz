/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/24/18
 */
TangoWebapp.UserActionController = MVC.Controller.extend('user_action_controller',
    /** @Static */
    {
        logger: null
    },
    /** @Prototype */
    {
        "platform_api.ui.initialized subscribe":function(){
            this.Class.logger = $$('user-log');
            this.Class.logger.log(new TangoWebapp.UserAction({
                id: webix.uid(),
                value: ['Welcome, <span class="webix_strong">', PlatformContext.UserContext.user, '</span>!!!'].join(''),
                timestamp: +new Date()
            }));
        },
        "user_action.log subscribe":function(event){
            this.Class.logger.log(event.data);
        }
    });

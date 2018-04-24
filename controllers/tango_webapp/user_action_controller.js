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
            this.Class.logger = $$('main-log');
        },
        "user_action.log subscribe":function(event){
            this.Class.logger.log(event.data);
        }
    });

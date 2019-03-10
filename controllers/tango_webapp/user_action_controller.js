/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/24/18
 */
TangoWebapp.UserActionController = class extends MVC.Controller {
    static get className() {
        return 'user_action_controller';
    }

    constructor() {
        super();
        this.logger = $$('user-log');
    }

    "platform_api.ui.initialized subscribe"() {
        this.logger.log(new TangoWebapp.UserAction({
            id: webix.uid(),
            value: ['Welcome, <span class="webix_strong">', PlatformContext.UserContext.user, '</span>!!!'].join(''),
            timestamp: +new Date()
        }));
    }

    "user_action.log subscribe"(event) {
        this.Class.logger.log(event.data);
    }
};

TangoWebapp.UserActionController.initialize();

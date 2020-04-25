import {Controller} from "@waltz-controls/middleware";
import {
    kUserActionDone,
    kUserActionsChannel,
    kUserActionSubmit,
    UserAction,
    UserActionService
} from "models/user_action";

export const kControllerUserAction = 'controller:user_action';
export default class UserActionController extends Controller {
    constructor() {
        super(kControllerUserAction);
    }

    config(){
        this.listen((action, event) => {
            UserActionService.create(action, this.app.context, this.app.middleware.bus).execute();
        },kUserActionSubmit,kUserActionsChannel);
    }

    /**
     *
     * @param {typeof UserAction} action
     */
    submit(action) {
        this.dispatch(action, kUserActionSubmit, kUserActionsChannel);



            const outer = action;
            return new Promise((resolve, reject) => {
                const listener = (action) => {
                    const timeout = setTimeout(() => {
                        this.middleware.bus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                        reject({
                            errors: [new Error(`UserAction[id=${this.id};action=${this.action};target=${this.target}] has failed due to 3s timeout`)]
                        });
                    }, 3000);

                    if(action.id === outer.id){
                        clearTimeout(timeout);
                        this.middleware.bus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                        if(action.hasFailed()){
                            reject(action.data);
                        } else {
                            resolve(action.data);
                        }
                    }
                };

                this.middleware.bus.subscribe(kUserActionDone,listener, kUserActionsChannel)
            });
    }
}
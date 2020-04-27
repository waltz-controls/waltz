import {Controller} from "@waltz-controls/middleware";
import {kUser} from "widgets/login";
import UserContext from "models/user_context";
import {kChannelLog, kTopicError} from "controllers/log";

export const kControllerUserContext = 'controller:user_context';
export const kUserContext = 'context:user_context';
export default class UserContextController extends Controller {
    constructor() {
        super(kControllerUserContext);
    }

    config(){
    }

    async run(){
        const user = await this.app.getContext(kUser)
        this.app.registerContext(kUserContext, UserContext.load(user.name, {headers:{...user.headers}})
            .catch(err => {
                this.dispatch(err, kTopicError, kChannelLog);
                throw err;//TODO throw critical error that prevents the whole application from proceeding
            }));
    }

    /**
     * @return {Promise<UserContext>}
     */
    get(){
       return this.app.getContext(kUserContext);
    }

    /**
     * Saves UserContext
     *
     * @return {Promise<UserContext>}
     */
    save(){
        return this.get()
            .then(ctx => ctx.save())
            .then(resp => {
                if (resp.ok)
                    return this.get();
                else
                    throw new Error(`Failed to save UserContext[${context.user}] due to  ${resp.status}:${resp.statusText}`)
            })
            .catch(err => {
                this.dispatch(err, kTopicError, kChannelLog);
                throw err;
            })
    }
}
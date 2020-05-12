import {Controller} from "@waltz-controls/middleware";
import {kUser} from "widgets/login";
import UserContext from "models/user_context";
import {kChannelLog, kTopicError} from "controllers/log";

export const kControllerUserContext = 'controller:user_context';
export const kUserContext = 'context:user_context';

class DecoratedUserContext extends UserContext {
    constructor({user, tango_hosts, device_filters, ext, controller}) {
        super({user, tango_hosts, device_filters, ext});
        this.controller = controller;
    }

    save(host, options){
        return super.save(host, options)
            .then(resp => {
                if (resp.ok)
                    return this;
                else
                    throw new Error(`Failed to save UserContext[${context.user}] due to  ${resp.status}:${resp.statusText}`)
            })
            .catch(err => {
                this.dispatch(err, kTopicError, kChannelLog);
                throw err;
            })
    }

}

/**
 *
 * @param id
 * @param options
 * @return {Promise<UserContext>}
 */
function load(id, options){
    return fetch(`/user-context/cache?id=${id}`, options)
        .then(resp => {
            //TODO 404
            if(resp.ok)
                return resp.text()
            else
                throw new Error(`Failed to load UserContext[${id}] due to ${resp.status}: ${resp.statusText}`)
        })
        .then(text => JSON.parse(atob(text)))
        .then(json => new DecoratedUserContext({...json}));
}

export default class UserContextController extends Controller {
    constructor() {
        super(kControllerUserContext);
    }

    config(){
    }

    async run(){
        const user = await this.app.getContext(kUser)
        this.app.registerContext(kUserContext, load(user.name, {headers:{...user.headers}})
            .catch(err => {
                this.dispatch(err, kTopicError, kChannelLog);
                throw err;//TODO throw critical error that prevents the whole application from proceeding
            }));
    }
}
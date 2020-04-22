import {Controller} from "@waltz-controls/middleware";
import {kUser} from "widgets/login";
import UserContext from "models/user_context";

const kControllerUserContext = 'controller:user_context';
export const kUserContext = 'context:user_context';
export default class UserContextController extends Controller {
    constructor() {
        super(kControllerUserContext);
    }

    async run(){
        const user = await this.app.getContext(kUser)
        this.app.registerContext(kUserContext, UserContext.load(user.name, {headers:{...user.headers}}));
    }
}
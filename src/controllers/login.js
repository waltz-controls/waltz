/**
 * Login controller
 * @type {LoginController}
 * @class
 *
 */
import {Controller} from "@waltz-controls/middleware";
import {kLogin, kUser} from "widgets/login";

export default class LoginController extends Controller{
    constructor(app) {
        super('controller:login', app);
        this.listen(() => {
            webix.storage.session.remove(kUser)
            this.app.getContext(kLogin).then(login => login
                .run());
            this.app.clearContext();
        },'logout');
    }

    run(){
        this.app.getContext(kUser).then(user => webix.storage.session.put(kUser, user))
    }
}
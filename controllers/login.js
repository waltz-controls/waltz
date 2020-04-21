/**
 * Login controller
 * @type {LoginController}
 * @class
 *
 */
import {Controller} from "@waltz-controls/middleware";

export default class LoginController extends Controller{
    constructor() {
        super('login_controller');
    }

    config(){
        this.listen(user => webix.storage.session.put('user', user), 'login');

        this.listen(() => webix.storage.session.remove('user'),'logout');
    }
}
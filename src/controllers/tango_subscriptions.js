import {Controller} from "@waltz-controls/middleware";
import {kUser} from "widgets/login";
import {Subscriptions} from "@waltz-controls/tango-rest-client";

const kControllerTangoSubscriptions = "controller:tango_subscriptions";
export const kContextTangoSubscriptions = "context:tango_subscriptions";
export default class TangoSubscriptionsController extends Controller {
    constructor() {
        super(kControllerTangoSubscriptions);
    }

    config(){

    }

    async run(){
        const user = await this.app.getContext(kUser);
        this.app.registerContext(kContextTangoSubscriptions,  new Subscriptions('',{
            headers:{
                ...user.headers
            }
        }));
    }
}
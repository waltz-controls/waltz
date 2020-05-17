import {Controller} from "@waltz-controls/middleware";
import {kChannelLog, kTopicError, kTopicLog} from "./log";
import {kAnyTopic} from "@waltz-controls/eventbus";
import {Subject} from "rxjs";
import {throttleTime} from "rxjs/operators";
import {kChannelTangoRest} from "@waltz-controls/waltz-tango-rest-plugin";
import {kControllerUserAction} from "./user_action_controller";

const kControllerWebixMessage = 'controller:webix_message';

const kMessage = "<span class='webix_icon mdi mdi-bell-ring'></span>Something bad has just happened. Check out the log..."

const expire = 3000;
export default class WebixMessageController extends Controller {
    constructor() {
        super(kControllerWebixMessage);

        this.errors = new Subject();

        this.errors.pipe(
            throttleTime(expire)
        ).subscribe(() => this.show(kMessage, 'error'));
    }

    config(){
        this.listen({error: msg => {
                this.errors.next(Array.isArray(msg.errors) ? msg.errors[0].description : msg.message)
            }},kAnyTopic, kChannelTangoRest)

        this.listen({error: msg => {
                this.errors.next(Array.isArray(msg.errors) ? msg.errors[0].description : msg.message)
            }},kAnyTopic, kControllerUserAction)

        this.listen({ error:msg => {
            this.errors.next(Array.isArray(msg.errors) ? msg.errors[0].description : msg.message)
        }},kAnyTopic);

        this.listen(msg => {
            this.errors.next(msg)
        },kTopicError, kChannelLog)

        this.listen({ next: msg => {
            this.show(msg);
        },
        error: msg => {
            this.errors.next(msg)
        } },kTopicLog, kChannelLog)
    }

    show(msg, type){
        webix.message({type, text:msg, expire})
    }
}
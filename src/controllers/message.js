import {Controller} from "@waltz-controls/middleware";
import {kChannelLog, kTopicError, kTopicLog} from "./log";
import {kAnyTopic} from "@waltz-controls/eventbus";

const kControllerWebixMessage = 'controller:webix_message';
export default class WebixMessageController extends Controller {
    constructor() {
        super(kControllerWebixMessage);
    }

    config(){
        this.listen({ error:msg => {
            this.show(Array.isArray(msg.errors) ? msg.errors[0].description : msg.message, 'error')
        }},kAnyTopic);

        this.listen(msg => {
            this.show(msg, 'error')
        },kTopicError, kChannelLog)

        this.listen({ next: msg => {
            this.show(msg);
        },
        error: msg => {
            this.show(msg, 'error')
        } },kTopicLog, kChannelLog)
    }

    show(msg, type){
        webix.message({type, text:msg})
    }
}
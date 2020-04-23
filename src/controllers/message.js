import {Controller} from "@waltz-controls/middleware";
import {kChannelLog, kTopicError, kTopicLog} from "./log";

const kControllerWebixMessage = 'controller:webix_message';
export default class WebixMessageController extends Controller {
    constructor() {
        super(kControllerWebixMessage);
    }

    config(){
        this.listen(msg => {
            this.show(msg, 'error')
        },kTopicError, kChannelLog)

        this.listen(msg => {
            this.show(msg);
        },kTopicLog, kChannelLog)
    }

    show(msg, type){
        webix.message({type, text:msg})
    }
}
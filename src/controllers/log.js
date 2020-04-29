import {Controller} from "@waltz-controls/middleware";
import {kAnyTopic} from "@waltz-controls/eventbus";
import {kChannelTangoRest} from "controllers/tango_rest";

export const kApplicationLogController = 'controller:app_log';

function formatErrorMessage(error) {
    return Array.isArray(error.errors) && error.errors.map(err => `<p>${err.severity}: ${err.reason}<br/>
                                                                   ${err.description}<br/>
                                                                   ${err.origin}</p>`);
}

export const kChannelLog = 'channel:log';
export const kTopicError = 'topic:error';
export const kTopicLog = 'topic:log';
export default class ApplicationLogController extends Controller{
    constructor() {
        super(kApplicationLogController);
    }

    config(){
        this.listen({error: err => {
                $$('main-log').log({
                    type:'error',
                    timestamp: err.timestamp,
                    value: formatErrorMessage(err)
                });
            }},kAnyTopic, kChannelTangoRest)

        this.listen(msg => {
                $$('main-log').log({
                    type: 'error',
                    timestamp: +new Date(),
                    value: `<p>${msg}</p>`
                });
            },kTopicError, kChannelLog)

        this.listen({
            next :msg => {
            $$('main-log').log({
                timestamp: +new Date(),
                value: `<p>${msg}</p>`
            });
        },
        error: err => {
            this.dispatch(err, kTopicError, kChannelLog);
        }},kTopicLog, kChannelLog)
    }

}
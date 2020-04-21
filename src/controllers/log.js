import {Controller} from "@waltz-controls/middleware";
import {kAnyTopic} from "@waltz-controls/eventbus";
import {kChannelTangoRest} from "controllers/tango_rest";

export const kApplicationLogController = 'controller:app_log';

function formatErrorMessage(error) {
    return Array.isArray(error.errors) && error.errors.map(err => `<p>${err.severity}: ${err.reason}<br/>
                                                                   ${err.description}<br/>
                                                                   ${err.origin}</p>`);
}

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
    }

}
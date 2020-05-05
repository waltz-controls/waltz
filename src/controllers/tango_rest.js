import {Controller} from "@waltz-controls/middleware";
import {TangoRestApi, TangoRestApiRequest} from "@waltz-controls/tango-rest-client";
import {kUser} from "widgets/login";
import {map, mergeMap, share, switchMap} from "rxjs/operators";
import {from} from "rxjs";
import {Pollable} from "models/tango";

export const kControllerTangoTest = 'controller:tango_test';
export const kTangoRestContext = 'context:tango_rest';

export const kChannelTangoRest = "channel:tango_rest";

class DecoratedTangoRestApiRequest extends TangoRestApiRequest {
    constructor(request, middleware) {
        super(request.url,request.options);
        this.middleware = middleware;
    }

    get(what, options = {}){
        const request = super.get(what, options);
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    put(what, data, options = {}){
        const request = super.put(what, data, options);
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    post(what, data, options = {}){
        const request = super.post(what, data, options);
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    delete(what){
        const request = super.delete(what);
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }
}

class DecoratedTangoRestApi extends TangoRestApi {
    constructor(host = '', options = {}, middleware) {
        super(host, options);
        this.middleware = middleware;
    }

    toTangoRestApiRequest() {
        return new DecoratedTangoRestApiRequest(super.toTangoRestApiRequest(), this.middleware);
    }

    //TODO new decorated TangoXXX
}

export default class TangoRestController extends Controller {
    constructor() {
        super(kControllerTangoTest);
    }

    config(){
    }

    async run(){
        const user = await this.app.getContext(kUser);
        this.app.registerContext(kTangoRestContext, new DecoratedTangoRestApi('',{
            // mode:'cors',
            headers:{
                ...user.headers
            }
        }, this.middleware))
    }

}

/**
 * Helper function that loads pollStatus from a rest tango device
 *
 * @param {TangoDevice} device
 * @return {Observable<Pollable>}
 */
export function pollStatus(device){
    return device.admin().pipe(
        mergeMap(admin => admin.devPollStatus(device.name)),
        mergeMap(resp => from(resp.output)),
        map(Pollable.fromDevPollStatus),
        share()
    );
}


/**
 *
 * @param {TangoDevice} device
 * @param {Pollable} pollable
 * @param {boolean} polled
 * @param {number} poll_rate
 * @return {Observable<any>}
 */
export function updatePolling(device, pollable, polled, poll_rate = 0){
    return device.admin().pipe(
        switchMap(admin => {
            if (polled)
                if (!pollable.polled)
                    return admin.addObjPolling({
                        lvalue: [poll_rate],
                        svalue: [device.name, pollable.polling_type, pollable.name]
                    });
                else
                    return admin.updObjPollingPeriod({
                        lvalue: [poll_rate],
                        svalue: [device.name, pollable.polling_type, pollable.name]
                    });
            else if (pollable.polled)
                return admin.remObjPolling([device.name, pollable.polling_type, pollable.name]);
        })
    );
}
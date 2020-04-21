//import openajax
import MultiMap from "../../../resources/platform/multimap.js";

const kOpenAjaxEventName_Waltz_Subscription_open = "waltz.subscription.open";
const kEventSourceOpenTimeout = 3000;
const kOpenFailureThreshold = 5;


OpenAjax.hub.subscribe("platform_context.set_rest", (msg, event)=>{
    const context = event.data;
    const url = context.rest.url + "/tango";
    if(context.subscription === undefined) {
        context.subscription = new Subscription(url);
    } else {
        context.subscription.url = url;
    }
    context.subscription.reconnect();
});

OpenAjax.hub.subscribe(kOpenAjaxEventName_Waltz_Subscription_open, () => {
    console.log(kOpenAjaxEventName_Waltz_Subscription_open)
});

function findEventByTarget(target) {
    return el => el.target.host === target.host &&
        el.target.device === target.device &&
        el.target.attribute === target.attribute &&
        el.target.type === target.type;
}

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/28/19
 */
export class Subscription {
    constructor(url){
        this.url = url;
        this.source = null;
        this.id = 0;
        this.events = [];
        this.failures = [];
        this.listeners = new MultiMap();
    }

    reconnect(){
        this.connect()
            .then(()=> {
                this.source.open();
            })
            .catch((err) => {
                TangoWebappHelpers.error(`Failed to connect to ${this.url}! Retry in ${kEventSourceOpenTimeout}`, err);
                setTimeout(() => {
                    this.reconnect();
                },kEventSourceOpenTimeout);
            });
    }

    async connect(){
        const subscription = await new TangoWebappPlatform.TangoRestApiRequest({url: this.url})
            .subscriptions()
            .post("", this.events.map(event => event.target));
        let id, events, failures;
        ({id, events, failures} = subscription);
        this.id = id;
        this.events = events;
        this.failures = failures;
        this.source = new EventStream(`${this.url}/subscriptions/${id}/event-stream`, this);
    }

    async open(){
        this.events.forEach(event => {
            this.listeners.get(event.id).forEach(listener =>
                this.addEventListener(event, listener)
            )
        })
    }

    /**
     *
     * @param {Target} target
     * @return {Promise<Event>}
     */
    async putTarget(target) {
        const response = await new TangoWebappPlatform.TangoRestApiRequest({url: this.url}).subscriptions(this.id).put("", [target]);
        const events = response.map(event => new Event(event.id, event.target));
        const event = events.find(findEventByTarget(target));
        if (event === undefined) {
            TangoWebappHelpers.error("Failed to subscribe");
            throw "Failed to subscribe";
        }
        return event;
    }

    /**
     *
     * @param {Target} target
     * @param {Function({timestamp, data}): void} success
     * @param {Function({timestamp, data}): void} failure
     * @return {Promise<void>}
     */
    async subscribe(target, success, failure){
        let event = this.events.find(findEventByTarget(target));

        if(event === undefined){
            event = await this.putTarget(target);
            this.events.push(event);
        }

        const listener = function(event){
            if(event.data.startsWith("error")){
                failure({
                    timestamp: parseInt(event.lastEventId),
                    data: event.data
                });
            } else {
                success({
                    timestamp: parseInt(event.lastEventId),
                    data: JSON.parse(event.data)
                })
            }
        };

        //TODO return listener -> client preserves listener; client listens for open event and re-adds listeners
        this.listeners.put(event.id, listener);
        this.addEventListener(event, listener);
    }

    unsubscribe(target){
        let event = this.events.find(findEventByTarget(target));

        if(event === undefined){
            return;
        }

        const listeners = this.listeners.get(event.id);
        listeners.forEach(listener =>
            this.source.stream.removeEventListener(event.id, listener)
        );

        //TODO delete event from subscriptions
    }

    async addEventListener(event, listener){
        this.source.addEventListener(event.id, listener);
    }
}

export class EventStream{
    constructor(url, subscription){
        this.url = url;
        this.subscription = subscription;
        this.stream = null;
    }

    open(){
        this.stream = new EventSource(this.url,{
            withCredentials: true
        });

        this.stream.onopen = function(){
            TangoWebappHelpers.logWithPopup("EventStream open!");
            this.subscription.open();
        }.bind(this);

        this.stream.onerror = function(error){
            TangoWebappHelpers.error("EventStream error!", error);
            console.error(error);
            this.stream.close();
            this.subscription.reconnect();
        }.bind(this);
    }

    addEventListener(id, listener){
        this.stream.addEventListener(id, listener)
    }
}



export class Target {
    constructor(host, device, attribute, type) {
        this.host = host;
        this.device = device;
        this.attribute = attribute;
        this.type = type;
    }

}

export class Event{
    constructor(id, target){
        this.id = id;
        this.target = target;
    }
}

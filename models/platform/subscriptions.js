/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/28/19
 */
export class Subscriptions {
    constructor(){
        this.url = null;
        this.action = new MVC.Controller.Action.Subscribe("platform_context.set_rest subscribe",this.set_rest.bind(this));
    }

    async set_rest(event){
        this.url = event.data.rest.url;
        event.data.subscription = await Subscriptions.createSubscription();
        event.data.subscription.open()
    }

    static async createSubscription(){
        //TODO handle exceptions
        const subscription = await new TangoWebappPlatform.TangoRestApiRequest({url: this.instance.url + "/tango"}).subscriptions().post();
        let id, events, failures;
        ({id, events, failures} = subscription);
        return new Subscription(id, events, failures, this.instance.url);
    }
}

Subscriptions.instance = new Subscriptions();

export class Target {
    constructor(host, device, attribute) {
        this.host = host;
        this.device = device;
        this.attribute = attribute;
    }

}

export class Event{
    constructor(id, target){
        this.id = id;
        this.target = target;
        this.listeners = [];
    }
}

const kEventSourceOpenTimeout = 3000;
const kOpenFailureThreshold = 5;

export class Subscription{
    constructor(id, events = [], failures = [], url){
        this.id = id;
        this.events = events;
        this.failures = failures;
        this.url = url;
        this.source = null;
        this.action = new MVC.Controller.Action.Subscribe("platform_context.set_rest subscribe",this.set_rest.bind(this));
        this.openFailures = 0;
    }

    open(){
        if (this.openFailures >= kOpenFailureThreshold) {
            TangoWebappHelpers.error(`Failed to open event-stream to ${this.url}/tango/subscriptions/${this.id}/event-stream. Event system won't work! Try to refresh the page...`);
            return;
        }

        this.source = new EventSource(new TangoWebappPlatform.TangoRestApiRequest({url: this.url + "/tango"}).subscriptions(this.id).url + "/event-stream",{
            withCredentials: true
        });

        this.source.onerror = function(error){
            TangoWebappHelpers.error("EventSource error!", error);
            console.error(error);
            this.openFailures++;
            setTimeout(this.open.bind(this), kEventSourceOpenTimeout);
        }.bind(this);
    }

    close(){
        this.source.close();
    }

    set_rest(event){
        if(this.source.readyState === 0 /*CONNECTING*/ || this.source.readyState === 1 /*OPEN*/)
            this.close();

        this.url = event.data.rest.url;
        this.open();

        const listeners = this.events.map(event => event.listeners.map(listener => {return {id: event.id, listener}}))
            .reduce((acc,val) => acc.concat(val), []);
        listeners.forEach(listener => {
            webix.message("restore addEventListener", "debug");
            this.source.addEventListener(listener.id, listener.listener);
        });
    }

    /**
     *
     * @param {Target} target
     * @param success
     * @param failure
     * @returns {Promise<void>}
     */
    async addEventListener(target, success, failure){
        let event = this.events.find(this._getPredicate(target));

        if(event === undefined){
            const response = await new TangoWebappPlatform.TangoRestApiRequest({url: this.url + "/tango"}).subscriptions(this.id).put("", [target]);
            this.events.push.apply(this.events,response.map(event => new Event(event.id, event.target)));
            event = this.events.find(this._getPredicate(target));
            if(event === undefined) throw new Error("failed to subscribe...");
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

        event.listeners.push(listener);
        this.source.addEventListener(event.id, listener);
    }

    removeEventListener(target) {
        const event = this.events.find(this._getPredicate(target));
        if (event === undefined) return;


        //remove listener
        event.listeners.forEach(listener => {
            this.source.removeEventListener(event.id, listener)
        });
        //clear listeners
        event.listeners.length = 0;
        //TODO unsubscribe
    }

    _getPredicate(target) {
        return el => el.target.host === target.host &&
            el.target.device === target.device &&
            el.target.attribute === target.attribute &&
            el.target.type === target.type;
    }
}

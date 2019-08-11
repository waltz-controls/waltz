//import openajax

const kOpenAjaxEventName_Waltz_Subscription_open = "waltz.subscription.open";
const kEventSourceOpenTimeout = 3000;
const kOpenFailureThreshold = 5;


OpenAjax.hub.subscribe("platform_context.set_rest", (msg, event)=>{
    event.data.subscription = new Subscription(event.data.rest.url + "/tango");
    event.data.subscription.reconnect();
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
            this.addEventListener(event.target)
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

    async addEventListener(target){
        let event = this.events.find(findEventByTarget(target));

        if(event === undefined){
            event = await this.putTarget(target);
            this.events.push(event);
        }

        const listener = function(event){
            const name = `${target.host}/${target.device}/${target.attribute}.${target.type}`;
            if(event.data.startsWith("error")){
                OpenAjax.hub.publish(`${name}_error`,{
                    timestamp: parseInt(event.lastEventId),
                    data: event.data
                });
            } else {
                OpenAjax.hub.publish(name,{
                    timestamp: parseInt(event.lastEventId),
                    data: JSON.parse(event.data)
                })
            }
        };

        this.source.stream.addEventListener(event.id, listener);
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
            TangoWebappHelpers.debug("EventStream open!");
            this.subscription.open();
        }.bind(this);

        this.stream.onerror = function(error){
            TangoWebappHelpers.error("EventStream error!", error);
            console.error(error);
            this.stream.close();
            this.subscription.reconnect();
        }.bind(this);
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

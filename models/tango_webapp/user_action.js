OpenAjax.hub.subscribe("platform_context.create", (msg, event)=>{
    UserAction.init(event.data.eventbus);
    UserActionService.init(event.data.eventbus);
});

const kUserActionsChannel = "channel:user-actions";
const kUserActionSubmit = "user-action:submit";
const kUserActionDone = "user-action:done";

export class UserAction {
    constructor(user, action, target){
        this.id = +new Date();
        this.user = user;
        this.action = action;
        this.target = target;
    }

    static init(eventbus){
        this.eventbus = eventbus;
    }

    submit(){
        UserAction.eventbus.publish(kUserActionSubmit, this, kUserActionsChannel);
        return new Promise((resolve, reject) => {
            const listener = (msg) => {
                const timeout = setTimeout(() => {
                    msg.data.add_errors([new Error(`UserAction[id=${this.id};action=${this.action};target=${this.target}] has failed due to 3s timeout`)]);
                    UserAction.eventbus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                    reject(msg.data);
                }, 3000);

                if(msg.id === this.id){
                    UserAction.eventbus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                    if(Array.isArray(msg.data.errors) && msg.data.errors.length){
                        reject(msg.data);
                    } else {
                        clearTimeout(timeout);
                        resolve(msg.data);
                    }
                }
            };

            UserAction.eventbus.subscribe(kUserActionDone,listener, kUserActionsChannel)
        });
    }
}

class TangoUserAction extends UserAction{
    constructor(user, action) {
        super(user, action, 'tango');
    }
}

export class WriteTangoAttribute extends TangoUserAction {
    constructor({user, attribute, value} = {}) {
        super(user, 'write');
        this.attribute = attribute;
        this.value = value;
    }
}

export class ExecuteTangoCommand extends TangoUserAction {
    constructor({user, command, value} = {}) {
        super(user, 'exec');
        this.command = command;
        this.value = value;
    }
}

export class UpdateDeviceAlias extends TangoUserAction {
    constructor({user, device, alias, remove} = {}) {
        super(user, 'alias');
        this.device = device;
        this.alias = alias;
        this.remove = remove;
    }
}

export class ExecuteUserScript extends UserAction {
    constructor({user, script}) {
        super(user, 'run','script');
        this.script = script;
    }
}

/**
 * Executes and logs corresponding user action
 *
 * @example
 * UserAction.writeAttribute(attr, value)
 *                               .then(function(){
 *                                    alert(":)");
 *                               })
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/24/18
 * @class
 * @type {UserAction}
 * @property {number} id
 * @property {string} type
 * @property {string} value
 * @property {number} timestamp
 * @extends MVC.Model
 * @memberof TangoWebappPlatform
 */
export class UserActionService {
    constructor(action){
        this.action = action;
    }

    static init(eventbus){
        this.eventbus = eventbus;

        this.eventbus.subscribe(kUserActionSubmit, (msg, event) => {
            UserActionService.create(msg).execute();
        }, kUserActionsChannel)
    }

    static create(action){
        switch(action.target){
            case "script":
                return new ScriptExecutionService(action);
            case "tango":
                return new TangoUserActionExecutionService(action);
        }
    }

    execute(){

    }

    publishResult(result){
        UserActionService.eventbus.publish(kUserActionDone,result,kUserActionsChannel);
    }
}

export class ScriptExecutionService extends UserActionService {
    constructor(action) {
        super(action);
    }

    execute() {
        this.action.script.execute().then(script => {
            this.publishResult(Object.assign(this.action,{data:script}));
        }).catch(script => {
            this.publishResult(Object.assign(this.action,{data:script}));
        });
    }
}

export class TangoUserActionExecutionService extends UserActionService {
    constructor(action) {
        super(action);
    }

    execute() {
        switch(this.action.action){
            case "read":
                this.action.attribute.read().then((result)=>{
                    this.publishResult(Object.assign(this.action,{data:result}));
                });
                return;
            case "write":
                this.action.attribute.write(this.action.value).then((result)=>{
                    this.publishResult(Object.assign(this.action,{data:result}));
                });
                return;
            case "exec":
                this.action.command.execute(this.action.value).then((result)=>{
                    this.publishResult(Object.assign(
                        this.action,{data:
                                Object.assign(result,{input:this.action.value})}));
                });
                return;
            case "alias":
                if(this.action.remove){
                    this.action.device.deleteAlias().then((result)=>{
                        this.publishResult(Object.assign(this.action,{data:result}));
                    });
                } else {
                    this.action.device.updateAlias(this.action.alias).then((result)=>{
                        this.publishResult(Object.assign(this.action,{data:result}));
                    });
                }
                return;
        }
    }
}

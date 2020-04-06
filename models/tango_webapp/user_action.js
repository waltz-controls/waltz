import {TangoId} from "../platform/tango_id.js";

OpenAjax.hub.subscribe("platform_context.create", (msg, event)=>{
    UserAction.init(event.data.eventbus);
    UserActionService.init(event.data.eventbus);
});

export const kUserActionsChannel = "channel:user-actions";
export const kUserActionSubmit = "user-action:submit";
export const kUserActionDone = "user-action:done";

export class UserAction {
    constructor(user, action, target, redoable = false){
        this.id = +new Date();
        this.user = user;
        this.action = action;
        this.target = target;
        this.data = {};
        this.redoable = redoable;
    }

    static init(eventbus){
        this.eventbus = eventbus;
    }

    submit(){
        UserAction.eventbus.publish(kUserActionSubmit, this, kUserActionsChannel);
        return new Promise((resolve, reject) => {
            const listener = (action) => {
                const timeout = setTimeout(() => {
                    UserAction.eventbus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                    reject({
                        errors: [new Error(`UserAction[id=${this.id};action=${this.action};target=${this.target}] has failed due to 3s timeout`)]
                    });
                }, 3000);

                if(action.id === this.id){
                    clearTimeout(timeout);
                    UserAction.eventbus.unsubscribe(kUserActionDone, listener, kUserActionsChannel);
                    if(action.hasFailed()){
                        reject(action.data);
                    } else {
                        resolve(action.data);
                    }
                }
            };

            UserAction.eventbus.subscribe(kUserActionDone,listener, kUserActionsChannel)
        });
    }

    toMessage(){
        return `<span><span class="webix_icon mdi mdi-account"></span><strong>${this.user}</strong>`;
    }

    hasFailed(){
        return Array.isArray(this.data.errors) && this.data.errors.length;
    }
}

class TangoUserAction extends UserAction{
    constructor({user, action, tango_id} = {}) {
        super(user, action, 'tango', true);
        this.tango_id = tango_id;
    }

    toMessage() {
        return super.toMessage() + ` performs tango action: <i>${this.action}</i></span>
                                    <div><ul><li>host: <i>${this.tango_id.tangoHost}</i></li>
                                             <li>device: <i>${this.tango_id.deviceName}</i></li>
                                             <li>member: <i>${this.tango_id.memberName}</i></li>
                                    </ul></div>`;
    }
}

export class WriteTangoAttribute extends TangoUserAction {
    /**
     *
     * @param user
     * @param {TangoAttribute} attribute
     * @param value
     */
    constructor({user, attribute, value} = {}) {
        super({user, action:'write', tango_id: TangoId.fromAttributeId(attribute.id)});
        this.attribute = attribute;
        this.value = value;
    }

    toMessage() {
        return super.toMessage() + `<div>.write(${this.value})</div>`;
    }
}

export class ExecuteTangoCommand extends TangoUserAction {
    constructor({user, command, value} = {}) {
        super({user, action:'exec', tango_id: TangoId.fromAttributeId(command.id)});
        this.command = command;
        this.value = value;
    }

    toMessage() {
        return super.toMessage() + `<div>.execute(${this.value}) => ${this.data.output}</div>`;
    }
}

export class UpdateDeviceAlias extends TangoUserAction {
    constructor({user, device, alias, remove} = {}) {
        super({user, action:'alias', tango_id: TangoId.fromAttributeId(`${device.id}/alias`)});
        this.device = device;
        this.alias = alias;
        this.remove = remove;
    }

    toMessage() {
        return super.toMessage() + `<div>${this.remove ? 'removes' : ''} ${this.device.id}.alias(${this.alias})</div>`;
    }
}

export class ExecuteUserScript extends UserAction {
    constructor({user, script}) {
        super(user, 'run','script');
        this.script = script;
    }

    toMessage() {
        return super.toMessage() + " executes script " + this.script.id + "</span>";
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
            case "write":
                this.action.attribute.write(this.action.value).then((result)=>{
                    this.publishResult(Object.assign(this.action,{data:result}));
                }).fail(result=> {
                    this.publishResult(Object.assign(this.action,{data:result}));
                });
                return;
            case "exec":
                this.action.command.execute(this.action.value).then((result)=>{
                    this.publishResult(Object.assign(
                        this.action,{data:
                                Object.assign(result,{input:this.action.value})}));
                }).fail(result=> {
                    this.publishResult(Object.assign(this.action,{data:result}));
                });
                return;
            case "alias":
                if(this.action.remove){
                    this.action.device.deleteAlias().then((result)=>{
                        this.publishResult(Object.assign(this.action,{data:result}));
                    }).fail(result=> {
                        this.publishResult(Object.assign(this.action,{data:result}));
                    });
                } else {
                    this.action.device.updateAlias(this.action.alias).then((result)=>{
                        this.publishResult(Object.assign(this.action,{data:result}));
                    }).fail(result=> {
                        this.publishResult(Object.assign(this.action,{data:result}));
                    });
                }
                return;
        }
    }
}

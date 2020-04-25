import {TangoId} from "@waltz-controls/tango-rest-client";


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
        this.data = script;
    }

    toMessage() {
        return super.toMessage() + " executes script " + this.data.id + "</span>";
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
    constructor(action, context, eventbus){
        this.action = action;
        this.context = context;
        this.eventbus = eventbus;
    }

    static create(action, context, eventbus){
        switch(action.target){
            case "script":
                return new ScriptExecutionService(action, context, eventbus);
            case "tango":
                return new TangoUserActionExecutionService(action, context, eventbus);
        }
    }

    execute(){
        throw new Error("Not implemented!");
    }

    publishResult(result){
        this.eventbus.publish(kUserActionDone,result,kUserActionsChannel);
    }
}

function setData(action, data){
    action.data = data;
    return action;
}

class ScriptExecutionService extends UserActionService {
    constructor(action, context, eventbus) {
        super(action, context, eventbus);
    }

    execute() {
        this.action.data.execute(this.context).then(script => {
            this.publishResult(setData(this.action,script));
        }).catch(script => {
            this.publishResult(setData(this.action,script));
        });
    }
}

class TangoUserActionExecutionService extends UserActionService {
    constructor(action, context, eventbus) {
        super(action, context, eventbus);
    }

    execute() {
        switch(this.action.action){
            case "write":
                this.action.attribute.write(this.action.value).then((result)=>{
                    this.publishResult(setData(this.action,result));
                }).fail(result=> {
                    this.publishResult(setData(this.action,result));
                });
                return;
            case "exec":
                this.action.command.execute(this.action.value).then((result)=>{
                    this.publishResult(setData(this.action,{
                        ...result,
                        input:this.action.value
                    }));
                }).fail(result=> {
                    this.publishResult(setData(this.action,result));
                });
                return;
            case "alias":
                if(this.action.remove){
                    this.action.device.deleteAlias().then((result)=>{
                        this.publishResult(setData(this.action,result));
                    }).fail(result=> {
                        this.publishResult(setData(this.action,result));
                    });
                } else {
                    this.action.device.updateAlias(this.action.alias).then((result)=>{
                        this.publishResult(setData(this.action,result));
                    }).fail(result=> {
                        this.publishResult(setData(this.action,result));
                    });
                }
                return;
        }
    }
}

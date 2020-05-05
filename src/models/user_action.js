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
                                    <div><ul><li>host: <i>${this.tango_id.getTangoHostId()}</i></li>
                                             <li>device: <i>${this.tango_id.getTangoDeviceName()}</i></li>
                                             <li>member: <i>${this.tango_id.name}</i></li>
                                    </ul></div>`;
    }
}

export class ReadTangoPipe extends TangoUserAction {
    static get action(){
        return "pipe";
    }

    /**
     *
     * @param user
     * @param {TangoPipe} attribute
     */
    constructor({user, pipe} = {}) {
        super({user, action:ReadTangoPipe.action, ...pipe});
        this.pipe = pipe;
    }

    toMessage() {
        return super.toMessage() + `<div>.read()</div>`;
    }
}

export class ReadTangoAttribute extends TangoUserAction {

    static get action (){
        return "read";
    }
    /**
     *
     * @param user
     * @param {TangoAttribute} attribute
     */
    constructor({user, attribute} = {}) {
        super({user, action:ReadTangoAttribute.action, ...attribute});
        this.attribute = attribute;
    }

    toMessage() {
        return super.toMessage() + `<div>.read()</div>`;
    }
}

export class WriteTangoAttribute extends TangoUserAction {

    static get action (){
        return "write";
    }
    /**
     *
     * @param user
     * @param {TangoAttribute} attribute
     * @param value
     */
    constructor({user, attribute, value} = {}) {
        super({user, action:WriteTangoAttribute.action, ...attribute});
        this.attribute = attribute;
        this.value = value;
    }

    toMessage() {
        return super.toMessage() + `<div>.write(${this.value})</div>`;
    }
}

export class ExecuteTangoCommand extends TangoUserAction {
    static get action(){
        return "exec";
    }

    constructor({user, command, value} = {}) {
        super({user, action:ExecuteTangoCommand.action, ...command});
        this.command = command;
        this.value = value;
    }

    toMessage() {
        return super.toMessage() + `<div>.execute(${this.value}) => ${this.data.output}</div>`;
    }
}

export class UpdateDeviceAlias extends TangoUserAction {
    static get action (){
        return "alias";
    }

    constructor({user, device, alias, remove} = {}) {
        super({user, action:UpdateDeviceAlias.action, ...device});
        this.device = device;
        this.alias = alias;
        this.remove = remove;
    }

    toMessage() {
        return super.toMessage() + `<div>${this.remove ? 'removes' : ''} ${this.device.id}.alias(${this.alias})</div>`;
    }
}

export class UpdateTangoAttributeInfo extends TangoUserAction {
    static get action(){
        return "info"
    }

    constructor({user, attribute, info}) {
        super({user, action:UpdateTangoAttributeInfo.action, ...attribute});
        this.attribute = attribute;
        this.info = info;
    }

    toMessage() {
        return super.toMessage() + `<div>updates info of ${this.attribute.id}</div>`;
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


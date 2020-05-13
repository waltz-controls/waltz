export class UserAction {
    constructor(user, action, target, redoable = false){
        this.id = +new Date();
        this.user = user;
        this.action = action;
        this.target = target;
        this.data = {};
        this.redoable = redoable;
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
}

export class ExecuteUserScript extends UserAction {
    constructor({user, script}) {
        super(user, 'run','script');
        this.data = script;
    }
}


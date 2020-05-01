import {TangoId} from "@waltz-controls/tango-rest-client";

export const kChannelTango = "channel:tango";

export const kTangoTypeAttribute = "tango:attribute";
export const kTangoTypeCommand = "tango:command";
export const kTangoTypePipe = "tango:pipe";

function getTangoAttributeIcon(name, data_format){
    if(name === "State" || name === "Status")
        return 'heart-pulse';
    switch(data_format){
        case "SCALAR":
            return 'at';
        case "SPECTRUM":
            return 'chart-line';
        case "IMAGE":
            return 'image-outline'
    }
}

function getTangoCommandIcon(name){
    return name === "State" || name === "Status"
        ? 'heart-pulse'
        : 'play-box-outline'
}

class Member {
    constructor({id, name, icon, type, data_format, data_type, min_value, max_value, writable = false}) {
        this.id = id;
        this.tango_id = TangoId.fromMemberId(id);
        this.name = name;
        this.icon = icon;
        this.type = type;
        this.data_format = data_format;
        this.data_type = data_type;
        this.min_value = min_value;
        this.max_value = max_value;
        this.writable = writable;
        this.value = undefined;
    }

    get host(){
        return this.tango_id.getTangoHostId()
    }

    set host(host){
        Object.assign(this.tango_id, TangoId.fromTangoHost(host))
    }

    get device(){
        return this.tango_id.getTangoDeviceName();
    }

    set device(device){
        Object.assign(this.tango_id, TangoId.fromDeviceId(`${this.host}/${device}`));
    }

    isAttribute(){
        return this.type === kTangoTypeAttribute;
    }

    isCommand(){
        return this.type === kTangoTypeCommand;
    }

    isPipe(){
        return this.type === kTangoTypePipe;
    }
}


export class TangoAttribute extends Member {
    constructor({id, name, data_format, data_type, min_value, max_value, writable = false}) {
        super({id, name, icon:getTangoAttributeIcon(name, data_format), type:kTangoTypeAttribute, data_format, data_type, min_value, max_value, writable});
    }

    isScalar(){
        return this.data_format === "SCALAR";
    }

    isSpectrum(){
        return this.data_format === "SPECTRUM";
    }

    isImage(){
        return this.data_format === "IMAGE";
    }
}

export class TangoCommand extends Member {
    constructor({id, name, data_format, data_type, min_value, max_value, writable = false}) {
        super({id, name, icon: getTangoCommandIcon(name), type: kTangoTypeCommand, data_format, data_type, min_value, max_value, writable});
    }

    isVoid(){
        return this.data_type === "DevVoid";
    }
}

export class TangoPipe extends Member {
    constructor({id, name, data_format, data_type, min_value, max_value, writable = false}) {
        super({id, name, icon: "card-text-outline", type: kTangoTypePipe, data_format, data_type, min_value, max_value, writable});
    }

}
import {TangoId} from "@waltz-controls/tango-rest-client";

export const kChannelTango = "channel:tango";

export const kTangoTypeHost = "tango:host";
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
    constructor({id, host, device, name, icon, type, info, writable = false}) {
        this.id = id;
        this.host = host;
        this.device = device;
        this.tango_id = TangoId.fromMemberId(id);
        this.name = name;
        this.icon = icon;
        this.type = type;
        this.info = info;
        this.writable = writable;
        this.value = undefined;
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
    constructor({id, host, device, name, info}) {
        super({id, host, device, name, icon:getTangoAttributeIcon(name, info.data_format), type:kTangoTypeAttribute, info, writable: info.writable.includes('WRITE') && info.data_format !== "IMAGE"});
    }

    isScalar(){
        return this.info.data_format === "SCALAR";
    }

    isSpectrum(){
        return this.info.data_format === "SPECTRUM";
    }

    isImage(){
        return this.info.data_format === "IMAGE";
    }
}

export class TangoCommand extends Member {
    constructor({id, host, device, name, info, writable = false}) {
        super({id, host, device, name, icon: getTangoCommandIcon(name), type: kTangoTypeCommand, info, writable});
    }

    isVoid(){
        return this.info.data_type === "DevVoid";
    }
}

export class TangoPipe extends Member {
    constructor({id, host, device, name, info}) {
        super({id, host, device, name, icon: "card-text-outline", type: kTangoTypePipe, info, writable: info.writable});
    }
}
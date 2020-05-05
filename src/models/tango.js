import {TangoId} from "@waltz-controls/tango-rest-client";

export const kChannelTango = "channel:tango";

export const kTangoTypeHost = "tango:host";
export const kTangoTypeDevice = "tango:device";
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

//TODO extend TangoXXX from rest client

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

export class TangoHost {
    constructor({id, info}) {
        this.id = id;
        this.tango_id = TangoId.fromTangoHost(id);
        this.type = kTangoTypeHost;
        this.icon = 'database';
        this.info = info;
    }
}

export class TangoDevice {
    constructor({id, host, name, alias, info}) {
        this.id = id;
        this.tango_id = TangoId.fromDeviceId(id);
        this.host = host;
        this.type = kTangoTypeDevice;
        this.icon = 'developer-board';
        this.name = name;
        this.alias = alias;
        this.info = info;
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

export class Pollable {
    constructor({name, type, poll_rate}) {
        this.name = name;
        this.type = type;
        this.poll_rate = poll_rate;
    }

    /**
     *
     * @param {string} pollStatus e.g. "Polled attribute name = double_scalar\nPolling period (mS) = 1000\nPolling ring buffer depth = 10\n..."
     * @return {Pollable}
     */
    static fromDevPollStatus(pollStatus){
        const lines = pollStatus.split('\n');
        return new Pollable({
            name: lines[0].split(' = ')[1],
            type: lines[0].includes(' attribute ') ? kTangoTypeAttribute : kTangoTypeCommand,
            poll_rate: lines[1].split(' = ')[1]
        });
    }
}


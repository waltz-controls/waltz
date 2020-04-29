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


}


export class TangoAttribute extends Member {
    constructor({id, name, data_format, data_type, min_value, max_value, writable = false}) {
        super({id, name, icon:getTangoAttributeIcon(name, data_format), type:"attribute", data_format, data_type, min_value, max_value, writable});
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
        super({id, name, icon: getTangoCommandIcon(name), type: "command", data_format, data_type, min_value, max_value, writable});
    }

    isVoid(){
        return this.data_type === "DevVoid";
    }
}

export class TangoPipe extends Member {
    constructor({id, name, data_format, data_type, min_value, max_value, writable = false}) {
        super({id, name, icon: "card-text-outline", type: "pipe", data_format, data_type, min_value, max_value, writable});
    }

}
/**
 * @module XenvHQ
 */

export class DataSource {

    /**
     *
     * @param {string} devDataType
     */
    static devDataTypeToNexus(devDataType) {
        switch (devDataType) {
            case "DevDouble":
                return "float64";
            case "DevFloat":
                return "float32";
            case "DevLong":
                return "int32";
            case "DevLong64":
                return "int64";
            case "DevULong":
                return "uint32";
            case "DevULong64":
                return "uint64";
            case "DevShort":
                return "int16";
            default:
                return "string";
        }
    }

    constructor(src, nxPath, type, pollRate, dataType) {
        this.src = src;
        this.nxPath = nxPath;
        this.type = type;
        this.pollRate = pollRate;
        this.dataType = dataType;
    }
}

export class XenvServer {
    constructor(name, ver, state, status, device) {
        this.name = name;
        this.ver = ver;
        this.state = state;
        this.status = status;
        this.device = device;
    }
}

export class Profile {
    constructor(id, tango_host, instance_name) {
        this.id = id;
        this.value = id;//MVC.String.capitalize(id);
        this.tango_host = tango_host;
        this.instance_name = instance_name;
    }
}
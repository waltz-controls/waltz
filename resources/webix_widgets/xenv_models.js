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

    /**
     *
     * @return {Promise<string>}
     */
    fetchState(){
        return this.fetchAttrValue("State")
            .catch(() => "UNKNOWN")
    }

    /**
     *
     * @return {Promise<string>}
     */
    fetchStatus(){
        return this.fetchAttrValue("Status")
            .catch(() => "UNKNOWN")
    }

    /**
     *
     * @param attr
     * @return {Promise<AttributeValue>}
     */
    fetchAttrValue(attr){
        return this.device.fetchAttr(attr).then(attr => attr.read()).then(resp => resp.value);
    }
}

export class ConfigurationManager extends XenvServer {
    constructor(){
        super("ConfigurationManager",undefined,"UNKNOWN", "Proxy is not initialized", null)
    }

    async readNexusFileWebix(){
        if(this.device === null) return "";
        return await this.fetchAttrValue("nexusFileWebixXml");
    }

    async readPreExperimentDataCollectorYaml(){
        if(this.device === null) return "";
        return await this.fetchAttrValue("preExperimentDataCollectorYaml");
    }

    async writePreExperimentDataCollectorYaml(value){
        if(this.device === null) return;
        const attr = await this.device.fetchAttr("preExperimentDataCollectorYaml");
        return UserAction.writeAttribute(attr, value);
    }
}

export class DataFormatServer extends XenvServer {
    constructor(){
        super("DataFormatServer",undefined,"UNKNOWN", "Proxy is not initialized", null)
    }

    async readCwd(){
        if(this.device === null) return undefined;
        return await this.fetchAttrValue("cwd");
    }

    async readNxTemplate(){
        if(this.device === null) return undefined;
        return await this.fetchAttrValue("nxTemplate");
    }

    async readNxFile(){
        if(this.device === null) return undefined;
        return await this.fetchAttrValue("nxFile");
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
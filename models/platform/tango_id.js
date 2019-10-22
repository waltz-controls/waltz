/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 22.10.2019
 */


const kTangoIdSeparator = '/';

export class TangoId {
    constructor(tango_host, tango_port, domain, family, member, entity){
        this.tango_host = tango_host;
        this.tango_port = tango_port;
        this.domain = domain;
        this.family = family;
        this.member = member;
        this.entity = entity;
    }

    hasDevice(){
        return this.domain !== undefined;
    }

    hasMember(){
        return this.entity !== undefined;
    }

    toString(){
        return `${this.tangoHost}/${this.deviceName}/${this.memberName}`
    }

    get tangoHost(){
        return `${this.tango_host}:${this.tango_port}`;
    }

    get deviceName(){
        return `${this.domain}/${this.family}/${this.member}`;
    }

    get memberName(){
        return this.entity;
    }

    static fromDeviceId(deviceId){
        const splits = deviceId.split(kTangoIdSeparator);
        const tango_host_port = splits[0].split(':');

        return new TangoId(tango_host_port[0], tango_host_port[1], splits[1], splits[2], splits[3])
    }
}
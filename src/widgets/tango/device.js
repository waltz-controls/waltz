import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoAttribute, kActionSelectTangoDevice} from "widgets/tango/actions";
import {kTangoRestContext} from "controllers/tango_rest";
import "views/tango/device_view_panel";
import {forkJoin, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {kChannelLog, kTopicLog} from "controllers/log";

export const kTangoDeviceWidget = 'widget:tango_device';

function getHeader(name = ''){
    return webix.template(`<span class='webix_icon mdi mdi-developer-board'></span> Device: ${name}`)
}

function setHeader(name, target) {
    target.config.header = target.config.headerAlt = getHeader(name);
    target.refresh()
}

function getAttributeIcon(name, data_format){
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

function catchFetchMembersError(members){
    return catchError(err => {
        this.dispatchError(`Failed to get ${members} for device ${this.deviceId}`, kTopicLog, kChannelLog);
        return of([]);
    });
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

export default class TangoDeviceWidget extends WaltzWidget {
    constructor() {
        super(kTangoDeviceWidget);
    }

    config(){
        this.listen(id => this.setDevice(id),kActionSelectTangoDevice)
        this.listen(id => this.readAttribute(id), kActionSelectTangoAttribute)
        // this.listen(id => this.setDevice(id),kActionSelectTangoCommand)
        // this.listen(id => this.setDevice(id),kActionSelectTangoPipe)
    }

    ui() {
        return {
            view: 'accordionitem',
            header: getHeader(),
            headerHeight:32,
            headerAlt:getHeader(),
            headerAltHeight: 32,
            body: {
                id: this.name,
                view: "device_view_panel",
                root: this
            }
        }
    }

    get widget(){
        return $$(kTangoDeviceWidget);
    }

    get tab(){
        return $$(kTangoDeviceWidget).getParentView();
    }

    get attributes(){
        return $$(kTangoDeviceWidget).$$("attrs")
    }

    get commands(){
        return $$(kTangoDeviceWidget).$$("commands")
    }

    get pipes(){
        return $$(kTangoDeviceWidget).$$("pipes")
    }

    clearAll(){
        this.attributes.clearAll();
        this.commands.clearAll();
        this.pipes.clearAll();

        $$(kTangoDeviceWidget).$$('device_control_attribute').reset();
        $$(kTangoDeviceWidget).$$('device_control_command').reset();
        $$(kTangoDeviceWidget).$$('device_control_pipe').reset();
    }

    async refresh(){
        if(!this.deviceId) return;
        this.widget.showProgress();
        this.clearAll();
        const rest = await this.app.getContext(kTangoRestContext);
        forkJoin(
            [rest.newTangoDevice(this.deviceId)
                .toTangoRestApiRequest()
                .get("?filter=name&filter=alias&filter=exported").pipe(
                    catchError(err => {
                        this.dispatchError(err, kTopicLog, kChannelLog);
                        return of({info:{exported: false}});
                    })
            ),
                rest.newTangoDevice(this.deviceId)
                    .attributes()
                    .get("?filter=id&filter=name&filter=data_format&filter=data_type&filter=writable&filter=min_value&filter=max_value").pipe(
                    catchFetchMembersError.call(this, 'attributes')
            ),
                rest.newTangoDevice(this.deviceId)
                    .commands()
                    .get("?filter=id&filter=name").pipe(
                    catchFetchMembersError.call(this, 'commands')
            ),
                rest.newTangoDevice(this.deviceId)
                    .pipes()
                    .get("?filter=id&filter=name").pipe(

                    catchFetchMembersError.call(this, 'pipes')
            )]
        ).subscribe(([device, attributes, commands, pipes]) => {
            setHeader(device.alias || device.name, this.tab);
            if(device.info.exported){
                this.widget.enable();
            } else {
                this.widget.disable();
                return;
            }
            this.attributes.parse(attributes.map(attr => new Member(
                {
                    ...attr,
                    ...attr.info,
                    icon: getAttributeIcon(attr.name, attr.info.data_format),
                    type: 'attribute',
                    writable: attr.info.writable.includes('WRITE') && attr.info.data_format !== "IMAGE"
                })));

            this.commands.parse(commands.map(cmd => new Member(
                {...cmd, icon: attributes.name === "State" || attributes.name === "Status"
                        ? 'heart-pulse'
                        : 'play-box-outline',
                type:'command'})));

            this.pipes.parse(pipes.map(pipe => new Member({...pipe, icon: 'card-text-outline', type: 'pipe'})));

            this.widget.hideProgress()
        });
    }

    setDevice(id){
        this.deviceId = id;
        this.refresh();


    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
        this.tab.collapse();
    }

    run(){
        this.render();
    }

    open(){
        this.tab.expand();
    }

    //TODO CQRS
    /**
     *
     * @param {TangoId} id
     */
    async readAttribute(id){
        if(!this.attributes.getItem(id.getTangoMemberId()).isScalar()) return;
        const rest = await this.app.getContext(kTangoRestContext);
        rest.newTangoAttribute(id)
            .read({
                headers:{
                    "Accept":"text/plain"
                }
            })
            .subscribe(resp => this.attributes.updateItem(id.getTangoMemberId(),{value: resp}))
    }
}
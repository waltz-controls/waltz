import "views/tango/device_controls";
import "views/tango/device_view_panel";

import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kActionSelectTangoAttribute, kActionSelectTangoDevice} from "widgets/tango/actions";
import {kTangoRestContext} from "controllers/tango_rest";

import {forkJoin, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {kChannelLog, kTopicLog} from "controllers/log";
import {TangoAttribute, TangoCommand, TangoPipe} from "models/tango";
import {kControllerUserAction,} from "controllers/user_action_controller";
import {ExecuteTangoCommand, ReadTangoAttribute, ReadTangoPipe, WriteTangoAttribute} from "models/user_action";
import {kUserContext} from "controllers/user_context";
import PipeWidget from "widgets/tango/pipe";
import CommandWidget from "widgets/tango/command";

export const kTangoDeviceWidget = 'widget:tango_device';

function getHeader(name = ''){
    return webix.template(`<span class='webix_icon mdi mdi-developer-board'></span> Device: ${name}`)
}

function setHeader(name, target) {
    target.config.header = target.config.headerAlt = getHeader(name);
    target.refresh()
}


function catchFetchMembersError(members){
    return catchError(err => {
        this.dispatchError(`Failed to get ${members} for device ${this.deviceId}`, kTopicLog, kChannelLog);
        return of([]);
    });
}

export default class TangoDeviceWidget extends WaltzWidget {
    constructor() {
        super(kTangoDeviceWidget);
    }

    config(){
        this.listen(id => this.setDevice(id),kActionSelectTangoDevice)
        this.listen(id => this.readAttribute(this.attributes.getItem(id.getTangoMemberId())), kActionSelectTangoAttribute)
        this.listen(action => {
            switch(action.action){
                case "read":
                    this.attributes.updateItem(action.attribute.id, {...action.data})
                    return;
            }
        }, kControllerUserAction)
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
                    .get().pipe(//"?filter=id&filter=name&filter=data_format&filter=data_type&filter=writable&filter=min_value&filter=max_value"
                    catchFetchMembersError.call(this, 'attributes')
            ),
                rest.newTangoDevice(this.deviceId)
                    .commands()
                    .get().pipe(//"?filter=id&filter=name&filter=in_type"
                    catchFetchMembersError.call(this, 'commands')
            ),
                rest.newTangoDevice(this.deviceId)
                    .pipes()
                    .get().pipe(//"?filter=id&filter=name"

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
            this.attributes.parse(attributes.map(attr => new TangoAttribute(
                {
                    ...attr
                })));
            this.attributes.sort("#name#");

            this.commands.parse(commands.map(cmd => new TangoCommand(
                {
                    ...cmd
                })));
            this.commands.sort("#name#");

            this.pipes.parse(pipes.map(pipe => new TangoPipe({...pipe})));
            this.pipes.sort("#name#");

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
     * @param {TangoAttribute} attribute
     */
    async readAttribute(attribute){
        if(!attribute.isScalar()) return;
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction).submit(new ReadTangoAttribute({user, attribute}));
    }

    async executeCommand(command, value){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction).submit(new ExecuteTangoCommand({user, command, value}));
    }

    async writeAttribute(attribute, value){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction).submit(new WriteTangoAttribute({user, attribute, value}));
    }

    openCommandWindow(cmd) {
        return new CommandWidget(this.app, cmd)
            .run();
    }

    /**
     *
     * @param {TangoPipe} pipe
     * @return {PipeWidget}
     */
    openPipeWindow(pipe){
        return new PipeWidget(this.app, pipe)
            .run();
    }

    async readPipe(pipe){

        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ReadTangoPipe({user, pipe}))
            .then(result => {
                this.openPipeWindow(Object.assign(pipe, result))
                    .update(result);
            });
    }
}
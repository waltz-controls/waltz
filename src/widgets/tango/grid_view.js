import "views/tango/grid_widget.jsx";
import {WaltzWidget} from "@waltz-controls/middleware";
import {kTangoRestContext} from "@waltz-controls/waltz-tango-rest-plugin";
import {forkJoin, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {kChannelLog, kTopicLog} from "controllers/log";
import {makeGridWidget} from "@waltz-controls/waltz-grid-widget";
import attribute from "./attribute";
import {kUserContext} from "@waltz-controls/waltz-user-context-plugin";

//TODO replace with Device from GridWidget
export class GridWidgetDevice {
    constructor({host, device, attributes, commands}) {
        this.name = {host, device};
        this.attributes = attributes;
        this.commands = commands;
    }
}

function catchFetchMembersError(members){
    return catchError(err => {
        this.dispatchError(`Failed to get ${members} for device ${this.deviceId}`, kTopicLog, kChannelLog);
        return of([]);
    });
}

export default class GridViewWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);
    }

    /**
     *
     * @returns {Promise<TangoRestApi>}
     */
    getTangoRest(){
        return this.app.getContext(kTangoRestContext)
    }

    get id(){
        return this.name;
    }

    get $view(){
        return $$(this.id);
    }

    get $grid(){
        return $$(this.id).$$('grid_widget');
    }

    ui(){
        const {GridWidget, api} = makeGridWidget(console.log);
        return {
            view: 'grid_widget_layout',
            root: this,
            GridWidget,
            api,
            id: this.id
        }
    }

    get api() {
        return this.$grid.config.api;
    }

    async restoreState(){
        const context = await this.app.getContext(kUserContext);
        const state = context.get(this.id, this.api.store.getState())
        this.api.setState(state);
    }

    async saveState(){
        const state = this.api.store.getState()

        const context = await this.app.getContext(kUserContext);
        context.ext[this.id] = state
        context.save().then(() => {
            this.dispatch(`Successfully saved state!`,kTopicLog,kChannelLog)
        })
    }

    /**
     *
     * @param {TangoId} id
     */
    async addDevice(id){
        const rest = await this.getTangoRest();

        forkJoin(
            [rest.newTangoDevice(id)
                .toTangoRestApiRequest()
                .get("?filter=host&filter=name&filter=alias&filter=exported").pipe(
                    catchError(err => {
                        this.dispatchError(err, kTopicLog, kChannelLog);
                        return of({info:{exported: false}});
                    }),
                    map(resp => {
                        resp.device = resp.name
                        return resp;
                    })
                ),
                rest.newTangoDevice(id)
                    .attributes()
                    .get("?filter=name").pipe(//"?filter=id&filter=name&filter=data_format&filter=data_type&filter=writable&filter=min_value&filter=max_value"
                    catchFetchMembersError.call(this, 'attributes')
                ),
                rest.newTangoDevice(id)
                    .commands()
                    .get("?filter=name&filter=in_type").pipe(//"?filter=id&filter=name&filter=in_type"
                    catchFetchMembersError.call(this, 'commands'),
                    map(resp => resp.filter(cmd => cmd.info.in_type === 'DevVoid'))
                )]
        ).subscribe(([device, attributes, commands]) => {
            this.$grid.addDevice(new GridWidgetDevice({
                ...device,
                attributes,
                commands
            }));
        })
    }

    async run(){
        const rest = await this.getTangoRest();


        const devices = this.api.store.getState().config.devices;

        devices.forEach(device => {
            rest.toTangoRestApiRequest().attributes().value().get("?" +
                device.attributes
                    .filter(attribute => attribute.show)
                    .map(attribute => `wildcard=${device.name.host}/${device.name.device}/${attribute.name}`)
                    .join('&')
                )
                .toPromise()
                .then(values => {
                        this.api.updateAttributes({
                            ...device,
                            attributes: values
                        })
                    }
                )
        })
    }
}
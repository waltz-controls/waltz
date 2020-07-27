import "views/tango/grid_widget.jsx";
import {WaltzWidget} from "@waltz-controls/middleware";
import {kTangoRestContext} from "@waltz-controls/waltz-tango-rest-plugin";
import {forkJoin, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {kChannelLog, kTopicLog} from "controllers/log";

export class GridWidgetDevice {
    constructor({host, device, attributes, commands}) {
        this.host = host;
        this.device = device;
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

    ui(){
        return {
            view: 'grid_widget',
            root: this,
            id: this.id
        }
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
            this.$view.addDevice(new GridWidgetDevice({
                ...device,
                attributes,
                commands
            }));
        })
    }
}
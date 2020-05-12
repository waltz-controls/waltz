import "views/tango/plotly_widget";
import {WaltzWidget} from "@waltz-controls/middleware";
import {kTangoRestContext} from "controllers/tango_rest";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicError, kTopicLog} from "controllers/log";
import {TangoAttribute} from "models/tango";
import {kNonPlottableDataTypes} from "views/tango/plot";
import {TangoId} from "@waltz-controls/tango-rest-client";

const kUnsupportedAttributeTypeMessage = "<span class='webix_icon mdi mdi-bell-ring'></span>This widget supports only scalar attributes!";

class ContextEntity {
    constructor({id, name, info}) {
        this.id = id;
        this.name = name;
        this.info = info;
    }
}

class Context {
    constructor() {
        this.hideSettings = false;
        this.attributes = [];
    }
}

const kForce = true;

export default class PlotlyWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);

        const proxy = {
            $proxy: true,
            load: (view, params, dp)=>{
                return this.getUserContext().then(userContext => userContext.getOrDefault(this.id, new Context()).attributes);
            },
            save: (view, params, dp)=>{
                switch (params.operation) {
                    case "insert":
                        return this.getUserContext()
                            .then(userContext => userContext.updateExt(this.id, ext => ext.attributes.push(new ContextEntity(params.data))))
                            .then(userContext => userContext.save())
                            .then(() => this.dispatch(`Successfully added new attribute ${params.id}`,kTopicLog,kChannelLog));
                    case "delete":
                        return this.getUserContext()
                            .then(userContext => userContext.updateExt(this.id, ext => {
                                const index = ext.attributes.findIndex(attr => attr.id === params.id)
                                ext.attributes.splice(index, 1);
                                return userContext;
                            }))
                            .then(userContext => userContext.save())
                            .then(() => this.dispatch(`Successfully removed attribute ${params.id}`,kTopicLog,kChannelLog));
                    default:
                        throw new Error(`Operation ${params.operation} is not supported!`)
                }

            }
        }

        this.attributes = new webix.DataCollection({
            url: proxy,
            save: proxy
        });

        this.restoreState();
    }

    get id(){
        return this.name;
    }

    /**
     *
     * @return {Promise<TangoRestApi>}
     */
    getTangoRest(){
        return this.app.getContext(kTangoRestContext);
    }

    /**
     *
     * @return {Promise<UserContext>}
     */
    getUserContext(){
        return this.app.getContext(kUserContext);
    }

    ui(){
        return {
            view: "plotly_widget",
            id: this.id,
            root: this
        }
    }

    get $$view(){
        return $$(this.id);
    }

    get $$plot(){
        return this.$$view.$$('plot');
    }

    get $$settings(){
        return this.$$view.$$('settings');
    }

    async restoreState() {
        await this.attributes.waitData;
        const attrs = this.attributes.find(() => true);

        this.$$plot.addTraces(
            attrs.map(attr => TangoId.fromMemberId(attr.id).getTangoDeviceName() + "/" + attr.name),
            attrs.map(() => []), attrs.map(() => []));

        this.$$settings.addAttributes(attrs.map(attr => webix.extend(attr, {name: TangoId.fromMemberId(attr.id).getTangoDeviceName() + "/" + attr.name}, kForce)))


        const hideSettings = (await this.getUserContext()).get(this.id).hideSettings;
        if(hideSettings)
            this.$$view.hideSettings();


        this.$$view.run();
    }


    /**
     *
     * @param {TangoId} id
     */
    async addAttribute(id){
        const rest = await this.getTangoRest();
        const attr = await rest.newTangoAttribute(id).toTangoRestApiRequest().get('?filter=id&filter=name&filter=data_type&filter=data_format')
            .toPromise()
            .then(resp => new TangoAttribute(resp))

        if(!attr.isScalar()){
            this.$$view.showOverlay(kUnsupportedAttributeTypeMessage)
            return;
        }
        if (kNonPlottableDataTypes.includes(attr.info.data_type)) {
            this.$$view.showOverlay(`Can not plot attr[${attr.name}] of type ${attr.info.data_type}`);
            return;
        }
        if (this.attributes.exists(attr.id)) {
            this.$$view.run();
        } else {
            this.attributes.add(new ContextEntity(attr));
            rest.newTangoAttribute(id).read().toPromise()
                .then(resp => {
                    const name = attr.tango_id.getTangoDeviceName() + "/" + attr.name;
                    this.$$plot.addTrace(name, [resp.timestamp], [resp.value], this.attributes.getIndexById(attr.id));
                    this.$$settings.addAttribute(webix.extend(attr, {name: name},kForce));
                })
                .catch(err => {
                    this.attributes.remove(attr.id);
                    this.dispatch(err,kTopicError,kChannelLog)
                    throw err;
                })
        }
    }

    /**
     *
     * @param {TangoId} id
     */
    removeAttribute(id){
        const index = this.attributes.getIndexById(id.getTangoMemberId());
        if(index === -1) throw new Error(`Assertion error: ${id.getTangoMemberId()} is not found in this widget`);

        this.$$plot.deleteTrace(index);
        this.$$settings.removeAttribute(id.getTangoDeviceName() + "/" + id.name);

        this.attributes.remove(id.getTangoMemberId());
    }
}
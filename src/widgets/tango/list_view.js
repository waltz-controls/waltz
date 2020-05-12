import "views/tango/attrs_monitor_view";
import {WaltzWidget} from "@waltz-controls/middleware";
import {kTangoRestContext} from "controllers/tango_rest";
import {kUserContext} from "controllers/user_context";
import {TangoAttribute} from "models/tango";
import {kChannelLog, kTopicLog} from "controllers/log";
import {WriteTangoAttribute} from "models/user_action";
import {kControllerUserAction} from "controllers/user_action_controller";

const kUnsupportedAttributeTypeMessage = "<span class='webix_icon mdi mdi-bell-ring'></span>This widget supports only scalar attributes!";

class ContextEntity{
    constructor({id,device,name,info}) {
        this.id = id;
        this.device = device;
        this.name = name;
        this.info = info;
    }
}

class Context{
    constructor() {
        this.hideSettings = false;
        this.hideColumns = {
            device: 1,
            name: 1,
            value: 1,
            save: 1,
            quality: 1,
            timestamp: 1,
            unit: 1,
            description: 1,
            remove: 1
        };
        this.attributes = [];
    }

}

export default class ListViewWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);

        const proxy = {
            $proxy: true,
            load: (view, params, dp) => {
                return this.getUserContext()
                    .then(userContext => userContext.getOrDefault(this.id, new Context()).attributes)
            },
            save: (view, params, dp) => {
                switch (params.operation) {
                    case "insert":
                        return this.getUserContext()
                            .then(userContext => userContext.updateExt(this.id, ext => ext.attributes.push(new ContextEntity(params.data))))
                            .then(userContext => userContext.save())
                            .then(() => this.dispatch(`Successfully added new attribute ${params.id}`,kTopicLog,kChannelLog));
                    case "update":
                        return Promise.resolve(params.data);
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
        })
    }

    ui(){
        return {
            view: "attrs_monitor",
            id: this.id,
            root: this
        }
    }

    run(){
        console.debug("Running ListView.run")
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

    get id(){
        return this.name;
    }

    get $$view(){
        return $$(this.id);
    }

    get $$scalars(){
        return this.$$view.$$('scalars');
    }

    /**
     *
     * @param {TangoId} id
     */
    async addAttribute(id){
        const rest = await this.getTangoRest();
        const attr = await rest.newTangoAttribute(id).toTangoRestApiRequest().get().toPromise()
            .then(resp => new TangoAttribute(resp));

        if(!attr.isScalar()) {
            this.$$view.showOverlay(kUnsupportedAttributeTypeMessage);
            return;
        }
        if(this.attributes.exists(attr.id)) return;
        const device = await rest.newTangoDevice(attr.tango_id).toTangoRestApiRequest().get('?filter=name&filter=alias').toPromise();

        attr.device = device.alias || device.name;

        this.attributes.add(attr);
    }

    /**
     *
     * @param {TangoId} id
     * @param value
     */
    async writeAttribute(id, value){
        const attribute = new TangoAttribute(this.attributes.getItem(id.getTangoMemberId()));

        const user = (await this.getUserContext()).user;
        if(attribute.isWritable())
            this.app.getController(kControllerUserAction).submit(
                new WriteTangoAttribute({user, attribute, value})
            )
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async removeAttribute(id){
        if(!this.attributes.exists(id.getTangoMemberId())) {
            throw new Error(`Attribute ${id.getTangoDeviceName()}/${id.name} is not monitored!`)
        }

        this.attributes.remove(id.getTangoMemberId());
    }

    async applySettings(settings){
        const userContext = await this.getUserContext();
        userContext.get(this.id).hideColumns = settings;
        this.$$scalars.applySettings(settings);
        userContext.save().then(() => () => this.dispatch(`Successfully applied settings`,kTopicLog,kChannelLog))
    }
}
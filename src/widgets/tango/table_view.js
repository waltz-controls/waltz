import "views/tango/table_widget";

import {WaltzWidget} from "@waltz-controls/middleware";

import {kTangoRestContext} from "controllers/tango_rest";
import {TangoAttribute, TangoDevice} from "models/tango";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicLog} from "controllers/log";
import {TangoId} from "@waltz-controls/tango-rest-client";

const kWidgetTableView = 'widget:table_view';

class ContextEntity{
    constructor({id, name, alias, info}) {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.info = info;
    }
}

class Context{
    constructor() {
        this.devices = [];
        this.attributes = [];
    }
}


function newProxy(target){
    return {
        $proxy: true,
        load: () => {
            return this.app.getContext(kUserContext).then(userContext => userContext.getOrDefault(this.id, new Context()))
        },
        save: (master, params, dataProcessor) => {
            switch (params.operation) {
                case "insert":
                    return this.getUserContext()
                        .then(userContext => userContext.updateExt(this.id, ext => ext[target].push(new ContextEntity(params.data))))
                        .then(userContext => userContext.save())
                        .then(() => this.dispatch(`Successfully added new ${target} ${params.data.name}`,kTopicLog, kChannelLog))
                        .catch(err => {debugger});
                case "delete":
                    return this.getUserContext()
                        .then(userContext => userContext.updateExt(this.id, ext => {
                            const index = ext[target].findIndex(device => device.id === params.id)
                            ext[target].splice(index,1);
                        }))
                        .then(userContext => userContext.save())
                        .then(() => this.dispatch(`Successfully deleted ${target} ${params.data.name}`,kTopicLog, kChannelLog));
                default:
                    throw new Error(`Unsupported operation ${params.operation}`);
            }
        }
    }
}


export default class TableViewWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);
        this.frozen = false;

        const devices = newProxy.call(this, 'devices');

        const attributes = newProxy.call(this,'attributes');

        this.devices = new webix.DataCollection({
            url: devices,
            save: devices
        });
        this.attributes = new webix.DataCollection({
            url: attributes,
            save: attributes
        });

        this.restoreState();
    }

    get id(){
        return this.name;
    }

    ui(){
        return {
            view:"table_widget",
            id: this.id,
            root: this
        }
    }

    getTangoRest(){
        return this.app.getContext(kTangoRestContext);
    }

    getUserContext(){
        return this.app.getContext(kUserContext);
    }

    get $$view(){
        return $$(this.id);
    }

    get $$datatable(){
        return this.$$view.$$('datatable')
    }

    get $$settings(){
        return this.$$view.$$('settings')
    }

    clear(){
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        this.$$datatable.clear();
        this.$$settings.clear();
    }

    async restoreState(){
        const userContext = await this.getUserContext();
        if(!userContext.get(this.id)) return;
        const attributes = userContext.get(this.id).attributes.map(attr => new TangoAttribute(attr));
        const devices = userContext.get(this.id).devices;

        this.$$datatable.addColumns(attributes);
        this.$$settings.addAttributes(attributes);

        this.$$datatable.parse(devices.map(device => ({...device, device: device.alias || device.name})));
    }

    selectAttribute(id){
        const attr = TangoAttribute.find_one(id);
        if(attr === null) {
            return loadAttribute(id)
                .then(attr => {
                    const columnConfig = this.$$('datatable').getColumnConfig(attr.name);
                    if(attr.isWritable() && columnConfig.editor !== "text"){
                        webix.extend(
                            columnConfig,
                            {
                                editor: "text"
                            }
                        );
                        this.$$('datatable').refreshColumns();
                    }
                })
                .then(attr => {
                    this.$$('input').setAttribute(attr);
                })
                .fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
        } else{
            const columnConfig = this.$$('datatable').getColumnConfig(attr.name);
            if(attr.isWritable() && columnConfig.editor !== "text") {
                webix.extend(
                    columnConfig,
                    {
                        editor: "text"
                    }
                );
                this.$$('datatable').refreshColumns();
            }

            this.$$('input').setAttribute(attr);
            return webix.promise.resolve(attr);
        }
    }

    /**
     *
     * @param {TangoId} id
     */
    removeAttribute(id){
        if(this.frozen) {
            this.$$view.showOverlay(kFrozenOverlayMessage);
            return;
        }
        this.$$datatable.removeAttribute(id.name);
        this.$$settings.removeAttribute(id.name);
    }

    /**
     *
     * @param {TangoId} id
     * @param force
     * @return {Promise<void>}
     */
    async addAttribute(id, force = false){
        const rest = await this.getTangoRest();

        const attr = await rest.newTangoAttribute(id).toTangoRestApiRequest().get().toPromise().then(resp => new TangoAttribute(resp));


        if(this.frozen && !force) {
            this.$$view.showOverlay(kFrozenOverlayMessage);
            return;
        }
        if(!attr.isScalar()) {
            this.$$view.showOverlay("Only SCALAR attributes are supported by this widget!");
            return;
        }

        this.$$datatable.addAttribute(attr, force);
        this.$$settings.addAttribute(attr, force);

        this.attributes.add(attr);
    }

    /**
     *
     * @param {TangoId} id
     * @return {Promise<void>}
     */
    async addDevice(id){
        if(this.frozen) {
            this.$$view.showOverlay(kFrozenOverlayMessage);
            return;
        }

        const rest = await this.getTangoRest();

        const device = await rest.newTangoDevice(id).toTangoRestApiRequest().get('?filter=!info').toPromise().then(resp => new TangoDevice(resp));

        this.$$datatable.addDevice(device);
        this.$$settings.addDevice(device);

        this.devices.add(device);
    }

    /**
     *
     * @param {TangoId} id
     */
    removeDevice(id){
        if(this.frozen) {
            this.showOverlay(kFrozenOverlayMessage);
            return;
        }
        this.$$datatable.removeDevice(id);
    }
}
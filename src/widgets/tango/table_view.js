import "views/tango/table_widget";

import {WaltzWidget} from "@waltz-controls/middleware";

import {kTangoRestContext} from "controllers/tango_rest";
import {TangoAttribute, TangoDevice} from "models/tango";

const kWidgetTableView = 'widget:table_view';



export default class TableViewWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);
        this.frozen = false;
        //TODO proxy
        this.devices = new webix.DataCollection();
        this.attributes = new webix.DataCollection();
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
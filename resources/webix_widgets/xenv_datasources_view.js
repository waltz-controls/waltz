/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 04.09.2019
 */

import newSearch from "./search.js";
import {newTangoAttributeProxy} from "./xenv.js";
import {DataSource} from "./xenv_models.js";

/**
 *
 *
 * @param {DataSource} dataSource
 * @param {string} value
 * @function
 */
const filterDataSourcesList = (dataSource, value)=>{
    if(!value) return true;
    return dataSource.src.includes(value) || dataSource.nxPath.includes(value);
};

function newDataSourceForm(parent){
    return {
        view: "form",
        id: "frmDataSource",
        on:{
            onBindApply(obj){
                if(!obj) return;
                this.setValues({
                    srcScheme:this.elements['srcScheme'].getList().find(option => obj.src.startsWith(option.value), true).value,
                    srcPath  : obj.src.substring(obj.src.indexOf(':') + 1)
                }, true);
            },
            onBeforeValidate(){
                this.setValues({
                    src: `${this.elements['srcScheme'].getValue()}${this.elements['srcPath'].getValue()}`
                },true);
            }
        },
        elements: [
            {cols:[
                    { view: "label", label: "src", maxWidth: 80 },
                    {view: "combo", name: "srcScheme", maxWidth: 120, options: [
                            "tine:", "tango:", "predator:", "external:"
                        ], validate: webix.rules.isNotEmpty},
                    {view: "text", name: "srcPath"},
                ]},
            {view: "text", name: "nxPath", label: "nxPath", validate: webix.rules.isNotEmpty},
            {
                view: "radio", name: "type", label: "type", options: [
                    "scalar", "spectrum", "log"
                ], validate: webix.rules.isNotEmpty
            },
            {view: "text", name: "pollRate", label: "pollRate", validate: webix.rules.isNumber},
            {
                view: "select", name: "dataType", label: "dataType", options: [
                    "string", "int16", "int32", "int64", "uint16", "uint32", "uint64", "float32", "float64"
                ]
            },
            {
                cols: [
                    {},
                    {
                        view: "button", width: 30, type: "icon", icon: "save", tooltip: "save", click() {
                            const $$form = this.getFormView();
                            // $$form.save();

                            if (!$$form.validate()) return;

                            const obj = $$form.getValues();
                            if (parent.$$("listDataSources").getSelectedId() == obj.id) {
                                parent.updateDataSource(obj);
                            } else {
                                obj.id = webix.uid();
                                parent.addDataSource(obj);
                            }
                        }
                    },
                    {
                        view: "button", width: 30, type: "icon", icon: "clone", tooltip: "clone", click(){
                            const $$form = this.getFormView();
                            if(!$$form.validate()) return;

                            const cloned = $$form.getValues();
                            cloned.id = webix.uid();

                            parent.addDataSource(cloned);
                        }
                    },
                    {
                        view: "button", width: 30, type: "icon", icon: "trash", tooltip: "delete", click(){
                            const $$form = this.getFormView();
                            const id = $$form.getValues().id;
                            parent.deleteDataSource({id})
                                .then(() => {
                                    $$form.clear();
                                });
                        }
                    }
                ]
            }
        ]
    };
}

function newDataSourcesList(parent){
    return {
        view: "list",
        id: "listDataSources",
        template:
            "<span class='webix_strong'>Src: </span>#src#<br/>" +
            "<span class='webix_strong'>nxPath: </span>#nxPath#",
        gravity: 4,
        type: {
            height: "auto"
        },
        scheme:{
            // add
            $init(obj){
                obj.id = obj._id;//copy mongodb _id
            }
        },
        on: {
            onItemClick(id){
                if(this.getSelectedId() === id){
                    this.unselectAll();
                } else {
                    this.select(id);
                }
            },
            onAfterSelect(id){
                parent.datasources.setCursor(id);
            },
            onBlur(){
                // $$hq.pushConfiguration();
            }
        }
    };
}

const dataSourcesProxy = {
        $proxy: true,
        load(view, params) {
            //TODO
        },
        save(view, params, dp) {
            switch (params.operations) {
                case "insert":
                    
            }
        },
        result() {

        }
}


function newDataSourceCollectionForm(parent){
    return {
        view: "form",
        id: "frmCollectionSettings",
        hidden: true,
        elements: [
            {
                cols: [
                    {
                        view: "text",
                        name: "id",
                        label: "DataSources collection id",
                        labelAlign: "right",
                        labelWidth: 200,
                        validate: webix.rules.isNotEmpty
                    },
                    {
                        view: "text",
                        id: "txtCollectionProto",
                        name: "value",
                        label: "Copy from",
                        labelAlign: "right",
                        suggest:{
                            id:"txtCollectionProtoSuggest",
                            data:[]
                        },
                        on:{
                            onItemClick:function(){
                                //link suggest to the input
                                $$(this.config.suggest).config.master = this;
                                //show
                                $$(this.config.suggest).show(this.$view)
                            }
                        }
                    }
                ]
            },
            {
                cols: [
                    {},
                    {
                        view: "button",
                        id: 'btnAddProfile',
                        type: "icon",
                        icon: "save",
                        maxWidth: 30,
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();

                            let promise;
                            if(values.value)
                                promise = parent.cloneCollection(values.id, values.value);
                            else
                                promise = parent.selectCollection(values.id);

                            promise.then(() => {
                                parent.collections.add({
                                    id: values.id,
                                    value: values.id
                                });

                                parent.$$('selectDataSources').setValue(values.id);
                            });
                        }
                    },
                    {
                        view: "button",
                        id: 'btnRmProfile',
                        type: "icon",
                        icon: "trash",
                        maxWidth: 30,
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();

                            //TODO #172
                            // webix.modalbox({
                            //     title:"<span><span class='webix_icon fa-exclamation-circle'> Attention</span>",
                            //     buttons:["Yes", "No"],
                            //     width:500,
                            //     text:`<p>This will drop the ${values.id} collection and all DataSources will be deleted! Proceed?</p>`
                            // }).then(() => {
                                parent.deleteCollection(values.id).then(() => {
                                    parent.collections.remove(values.id);
                                    parent.datasources.clearAll();
                                    parent.$$('selectDataSources').setValue("");
                                });
                            // });
                        }
                    }
                ]
            }
        ]
    };
}

function newToolbar(parent){
    return {
        view:"toolbar",
        cols:[
            {
                view:"combo",
                id: "selectDataSources",
                options:{
                    body: {
                        template:"#id#"
                    },
                    data:[]
                },
                on:{
                    onItemClick:function(){
                        //link suggest to the input
                        $$(this.config.suggest).config.master = this;
                        //show
                        $$(this.config.suggest).show(this.$view)
                    }
                }
            },
            {
                view: "button",
                type: "icon",
                icon: "plus",
                click(){
                    // const collection = parent.$$('selectDataSources').getValue();
                    // if(!collection) webix.message("<span class='webix_icon fa-bell'></span> Please specify the collection!");
                    // else parent.selectCollection(collection);
                    const $$form = this.getTopParentView().$$('frmCollectionSettings');
                    if($$form.isVisible())
                        $$form.hide();
                    else
                        $$form.show()
                }
            },
            {}
        ]
    }
}

function newSortButton(by) {
    return {
        view: "button",
        //TODO requires webix 6.x
        // css: "webix_transparent",
        type: "icon",
        label: `<span class='webix_strong'>${MVC.String.classize(by)}</span>`,
        dir: "asc",
        click() {
            this.getTopParentView().$$('listDataSources').sort(by, this.config.dir);
            this.config.dir = this.config.dir === "asc" ? "desc" : "asc";
        }
    }
}

function newSort() {
    return {
        view: "form",
        height: 30,
        cols: [
            {
                view: "label",
                label: "Sort by:",
                maxWidth: 80,
            },
            newSortButton('src'),
            newSortButton('nxPath'),
            {}
        ]
    }
}

const datasources_view = webix.protoUI({
    name: "datasources_view",
    collections: new webix.DataCollection(),
    datasources: new webix.DataCollection(),
    _ui(){
        return {
            rows:[
                newToolbar(this),
                newDataSourceCollectionForm(this),
                newSort(),//TODO replace with smart filter
                newSearch("listDataSources", filterDataSourcesList),
                newDataSourcesList(this),
                newDataSourceForm(this)
            ]
        }
    },
    selectCollection(collection){
        //TODO extract to proxy
        return PlatformContext.rest.request()
            .hosts(this.config.host)
            .devices(this.config.device)
            .attributes("datasourcescollection")
            .value().put("?v=" + collection)
            .then(() => {
                this.datasources.load(
                    newTangoAttributeProxy(PlatformContext.rest, "localhost/10000", "development/xenv/configuration", "datasources")
                );
            })
            .catch(err => TangoWebappHelpers.error(err));

    },
    setCollection(){
        const collection = this.$$('selectDataSources').getValue();
        return PlatformContext.rest.request()
            .hosts(this.config.host)
            .devices(this.config.device)
            .attributes("datasourcescollection")
            .value().put("?v=" + collection)
    },
    deleteCollection(collection){
        return this.config.rest.request()
            .hosts(this.config.host)
            .devices(this.config.device)
            .commands('deleteCollection')
            .put("", collection);
    },
    cloneCollection(collection, source){
        return this.config.rest.request()
            .hosts(this.config.host)
            .devices(this.config.device)
            .commands('cloneCollection')
            .put("", [collection,source]);
    },
    processDataSource(operation, dataSource){
        return this.setCollection()
            .then(() => {
                return this.config.rest.request()
                    .hosts(this.config.host)
                    .devices(this.config.device)
                    .commands(`${operation}datasource`)//insert|update|delete
                    .put("", dataSource);
            })
            .fail(err => {
                TangoWebappHelpers.error(err);
                throw err;
            });
    },
    addDataSource(dataSource){
        return this.processDataSource("insert",dataSource)
            .then(() => {
                return this.datasources.add(dataSource)
            })
    },
    updateDataSource(dataSource){
        return this.processDataSource("update", dataSource)
            .then(() => {
                this.datasources.updateItem(dataSource.id, dataSource);
            })
    },
    deleteDataSource(dataSource){
        return this.processDataSource("delete", dataSource).
            then(() => {
                this.datasources.remove(dataSource.id);
        })
    },
    /**
     *
     * @param {string} id
     */
    dropAttr(id){
        const attr = TangoAttribute.find_one(id);
        if(attr == null) return;

        const device = TangoDevice.find_one(attr.device_id);
        const $$list = this.$$('listDataSources');
        this.addDataSource(new DataSource(`tango://${attr.id}`,
            `/entry/hardware/${device.name}/${attr.name}`,
            "log",
            200,
            DataSource.devDataTypeToNexus(attr.info.data_type)))
            .then(id=>{
                $$list.select(id);
            });
    },
    $init(config){
        webix.extend(config,this._ui());
        webix.extend(config, {
            rest: PlatformContext.rest,
            host: "localhost/10000",
            device: "development/xenv/configuration"
        });

        this.$ready.push(() => {
            // this.collections.load();

            this.collections = new webix.DataCollection({
                url: newTangoAttributeProxy(PlatformContext.rest, this.config.host, this.config.device, "datasourcecollections")
            });


            const list = this.$$("selectDataSources").getPopup().getList();

            list.attachEvent("onAfterSelect", id => {
                this.selectCollection(id);
                this.collections.setCursor(id);
            });
            list.sync(this.collections);

            this.$$("txtCollectionProtoSuggest").getList().sync(this.collections);
            this.$$("frmCollectionSettings").bind(list);


            this.$$("listDataSources").sync(this.datasources);
            this.$$("frmDataSource").bind(this.datasources);
        });

        this.addDrop(this.getNode(),{
            /**
             * @function
             */
            $drop:function(source, target){
                var dnd = webix.DragControl.getContext();
                if(dnd.from.config.$id === 'attrs') {
                    this.dropAttr(dnd.source[0]);
                }

                return false;
            }.bind(this)
        });
    }
}, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newDataSourcesBody(config){
    return webix.extend({
        view: "datasources_view",
        id:"datasources_view_tab"
    },config);
}

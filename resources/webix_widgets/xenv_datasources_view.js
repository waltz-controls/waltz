/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 04.09.2019
 */

import newSearch from "./search.js";

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

function newTangoAttributeProxy(rest, host, device, attr) {
    return {
        $proxy: true,
        load(view, params) {
            view.clearAll();
            view.parse(rest.request().hosts(host).devices(device).attributes(attr).value().get()
                .then(value => JSON.parse(value.value))
                .catch(err => TangoWebappHelpers.error(err)));
        },
        save(view, params, dp) {
            //TODO
        },
        result() {

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


function newToolbar(parent){
    return {
        view:"toolbar",
        cols:[
            {
                view:"text",
                id: "selectDataSources",
                suggest:{
                    id:"selectDataSourcesSuggest",
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
                icon: "arrow-right",
                click(){
                    const collection = parent.$$('selectDataSources').getValue();
                    if(!collection) webix.message("<span class='webix_icon fa-bell'></span> Please specify the collection!");
                    else parent.selectCollection(collection);
                }
            },
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
                newSearch("listDataSources", filterDataSourcesList),
                newDataSourcesList(this),
                newDataSourceForm(this)
            ]
        }
    },
    selectCollection(collection){
        //TODO extract to proxy
        PlatformContext.rest.request()
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
    async addDataSource(dataSource){
        return this.processDataSource("insert",dataSource)
            .then(() => {
                this.datasources.add(dataSource)
            })
    },
    async updateDataSource(dataSource){
        return this.processDataSource("update", dataSource)
            .then(() => {
                this.datasources.updateItem(dataSource.id, dataSource);
            })
    },
    async deleteDataSource(dataSource){
        return this.processDataSource("delete", dataSource).
            then(() => {
                this.datasources.remove(dataSource.id);
        })
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
                url: newTangoAttributeProxy(PlatformContext.rest, "localhost/10000", "development/xenv/configuration", "datasourcecollections")
            });


            const list = this.$$("selectDataSourcesSuggest").getList();

            list.attachEvent("onAfterSelect", id => {
                this.selectCollection(id);
            });
            list.sync(this.collections);



            this.$$("listDataSources").sync(this.datasources);
            this.$$("frmDataSource").bind(this.datasources);
        });
    }
},webix.IdSpace, webix.ui.layout);

export function newDataSourcesBody(config){
    return webix.extend({
        view: "datasources_view",
        id:"datasources_view_tab"
    },config);
}

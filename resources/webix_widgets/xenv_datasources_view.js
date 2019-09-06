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
                        view: "button", width: 30, type: "icon", icon: "save", tooltip: "save", click: obj => {
                            parent.$$('frmDataSource').save();
                        }
                    },
                    {
                        view: "button", width: 30, type: "icon", icon: "clone", tooltip: "clone", click: obj => {
                            if(!parent.$$('frmDataSource').validate()) return;

                            const cloned = parent.$$('frmDataSource').getValues();
                            cloned._id = webix.uid();

                            parent.$$('listDataSources').add(cloned);
                        }
                    },
                    {
                        view: "button", width: 30, type: "icon", icon: "trash", tooltip: "delete", click: obj => {
                            const $$frm = parent.$$('frmDataSource');
                            const id = $$frm.getValues()._id;
                            $$frm.clear();
                            parent.$$('listDataSources').remove(id);
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
            onBlur(){
                // $$hq.pushConfiguration();
            },
            onAfterAdd: function (id) {
                parent.addDataSource(this.getItem(id));
            },
            onDataUpdate: function (id) {
                parent.updateDataSource(this.getItem(id));
            },
            onBeforeDelete: function (id) {
                parent.removeDataSource(this.getItem(id));
            }
        }
    };
}

function newDataSourceCollectionsProxy(rest, host, device) {
    return {
        $proxy: true,
        load(view, params) {
            return rest.request().hosts(host).devices(device).attributes("datasourcecollections").value().get()
                .then(value => JSON.parse(value.value))
                .catch(err => TangoWebappHelpers.error(err))//TODO return error?
        },
        save(view, params, dp) {

        },
        result() {

        }
    };
}

const datasources_view = webix.protoUI({
    name: "datasources_view",
    collections: new webix.DataCollection(),
    datasources: new webix.DataCollection(),
    _ui(){
        return {
            rows:[
                {
                    view:"toolbar",
                    cols:[
                        {
                            view:"richselect",
                            id: "selectDataSources",
                            options:[]
                        },
                        {}
                    ]
                },
                newSearch("listDataSources", filterDataSourcesList),
                newDataSourcesList(this),
                newDataSourceForm(this)
            ]
        }
    },
    async addDataSource(dataSource){
        const collection = this.$$("selectDataSources").getValue();

        const cmd = await this.config.configurationManager.device.fetchCommand("addDataSource");
        UserAction.executeCommand(cmd, [collection,JSON.stringify(dataSource)]).then(()=> {
            this.datasources.getItem(collection).data.push(dataSource);
            this.datasources.setCursor(collection);
        }).fail(err => TangoWebappHelpers.error(err));
    },
    async updateDataSource(dataSource){
        const collection = this.$$("selectDataSources").getValue();

        const cmd = await this.config.configurationManager.device.fetchCommand("updateDataSource");
        UserAction.executeCommand(cmd, [collection,JSON.stringify(dataSource)]).then(()=> {
            this.datasources.getItem(collection).data.push(dataSource);
            this.datasources.setCursor(collection);
        }).fail(err => TangoWebappHelpers.error(err));
    },
    $init(config){
        webix.extend(config,this._ui());

        this.$ready.push(() => {
            this.collections.define({url: newDataSourceCollectionsProxy(PlatformContext.rest,"localhost/10000", "development/xenv/configuration")});

            this.collections.load("");
            // this.collections.parse(PlatformContext.rest.request().hosts("localhost:10000").devices("development/xenv/configuration").attrs("datasourcecollections").get()
            //     .then(value => JSON.parse(value.value))
            //     .catch(err => TangoWebappHelpers.error(err)));

            const list = this.$$("selectDataSources").getPopup().getList();

            list.define("template", "#id#");

            list.attachEvent("onAfterSelect", id => {
                PlatformContext.rest.request().hosts("localhost:10000").devices("development/xenv/configuration").attrs("datasourcescollection").put(id)
                    .then(() => {
                        this.datasources.parse(PlatformContext.rest.request().hosts("localhost:10000").devices("development/xenv/configuration").attrs("datasourcescollection").get()
                            .then(value => JSON.parse(value.value))
                            .catch(err => TangoWebappHelpers.error(err)));
                    })
                    .catch(err => TangoWebappHelpers.error(err));
            });
            list.sync(this.collections);

            this.$$("listDataSources").sync(this.datasources);
            this.$$("frmDataSource").bind(this.$$("listDataSources"));
        });
    }
},webix.IdSpace, webix.ui.layout);

export function newDataSourcesBody(config){
    return webix.extend({
        view: "datasources_view",
        id:"datasources_view_tab"
    },config);
}

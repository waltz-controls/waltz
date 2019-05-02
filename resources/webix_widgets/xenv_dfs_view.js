import newSearch from "./search.js";
import {newXenvServerLog} from "./xenv_views.js";

const DfsViewBodyHeader = {
    id: 'header',
    template: "<span class='webix_strong'>DataFormatServer</span>  [<span class='webix_icon fa-microchip'></span> #ver#] | #state#",
    maxHeight: 40
};

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/27/19
 */
//TODO const DfsProxy

const kDfsData = [
    {id:"cwd", name:"Current dir", value: undefined},
    {id:"nxTemplate", name:"NeXus template", value: undefined},
    {id:"nxFile", name:"NeXus file", value: undefined}
];

const DfsViewBodyMain = {
    gravity: 3,
    cols:[
        {
            rows: [
                {
                    template: "NeXus file structure:",
                    type: "header"
                },
                newSearch("nxTemplate","#value#"),
                {
                    view: "tree",
                    label: "nxTemplate",
                    name: "nxTemplate",
                    id: "nxTemplate",
                    labelPosition: "top"
                }
            ]
        },
        {view:"resizer"},
        {
            rows:[
                {
                    template: "Attributes:",
                    type: "header"
                },
                {
                    view: "datatable",
                    id:"attributes",
                    header: false,
                    columns:[
                        {id:'name'},
                        {id:'value', fillspace: true}
                    ],
                    data: kDfsData
                }
            ]
        }
    ]
};

const dfs = webix.protoUI({
    name: "dfs",
    async update(){
        this.$$('header').setValues(this.config.dataFormatServer);

        const $$attributes = this.$$('attributes');
        $$attributes.data.each(async item => {
            const value = await this.config.dataFormatServer.fetchAttrValue(item.id);
            $$attributes.updateItem(item.id, {
                value
            })
        });

        const nexusFileXml = await this.config.configurationManager.readNexusFileWebix();
        this.$$('nxTemplate').clearAll();
        this.$$('nxTemplate').parse(nexusFileXml,"xml");
    },
    _ui(){
        return {
            padding: 15,
            rows: [
                DfsViewBodyHeader,
                DfsViewBodyMain,
                {view:"resizer"},
                newXenvServerLog()
            ]
        }
    },
    $init:function(config){
        webix.extend(config, this._ui());
    },
    defaults:{
        on:{
            "DataFormatServer.update.status subscribe"(event){
                this.$$('log').add(event,0);
                this.$$('header').setValues({
                    status: event.data
                });
            },
            onViewShow(){
                if(this.config.configurationManager.device == null) return;
                this.update();
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);

export function newDfsViewBody(config) {
    return webix.extend({
        view: "dfs"
    },config);
}


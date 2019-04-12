import {codemirror_textarea} from "./scripting_console.js";
import {newXenvServerLog} from "./xenv_views.js";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/27/19
 */
const routes_xml = webix.protoUI({
    name: "routes_xml",
    update(value){
        if(!value) return;
        this.setValue(value);
    }
},codemirror_textarea);

function newRoutesXmlView(){
    return {
        gravity: 2,
        rows: [
            {
                view: "routes_xml",
                id: "routes_xml",
                mode: "application/xml",
                matchClosing: true
            }
        ]
    }
}

const camel_view = webix.protoUI({
    name: "camel_view",
    async update(){
        debugger
        const value = await this.config.configurationManager.readRoutesXml();
        this.$$('routes_xml').update(value);
    },
    _ui(){
        return {
            rows:[
                newRoutesXmlView(),
                {view: "resizer"},
                newXenvServerLog()
            ]
        }
    },
    $init(config){
        webix.extend(config, this._ui());
    },
    defaults:{
        on:{
            "PreExperimentDataCollector.update.status subscribe"(event){
                this.$$('log').add(event,0);
            },
            onViewShow(){
                this.update();
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener,webix.IdSpace,webix.ui.layout);

export function newCamelIntegrationViewBody(config){
    return webix.extend({
        view: "camel_view"
    },config);
}
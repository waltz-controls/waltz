import {newXenvServerLog, newXmlView} from "./xenv_views.js";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/27/19
 */


const camel_view = webix.protoUI({
    name: "camel_view",
    async update(){
        const value = await this.config.configurationManager.readRoutesXml();
        this.$$('xml').update(value);
    },
    _ui(){
        return {
            rows:[
                newXmlView(),
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
            "CamelIntegration.update.status subscribe"(event){
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
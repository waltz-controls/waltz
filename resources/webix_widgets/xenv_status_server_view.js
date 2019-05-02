import {newXenvServerLog} from "./xenv_views.js";
import {newXmlView} from "./xenv_views.js";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/27/19
 */


const status_server_view = webix.protoUI({
    name: "status_server_view",
    async update(){
        const value = await this.config.configurationManager.readStatusServerXml();
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
            "StatusServer2.update.status subscribe"(event){
                this.$$('log').add(event,0);
            },
            onViewShow(){
                if(this.config.configurationManager.device == null) return;
                this.update();
            }
        }
    }
},TangoWebappPlatform.mixin.OpenAjaxListener,webix.IdSpace,webix.ui.layout);

export function newStatusServerViewBody(config){
    return webix.extend({
        view: "status_server_view"
    },config);
}

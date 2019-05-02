/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 3/27/19
 */
import {newXenvServerLog} from "./xenv_views.js";
import {codemirror_textarea} from "./scripting_console.js";


const meta_yaml = webix.protoUI({
    name: "meta_yaml",
    update(value){
        if(!value) return;
        this.setValue(value);
    }
},codemirror_textarea);

function newMetaYamlView(){
    return {
        gravity: 2,
        rows: [
            {
                view: "meta_yaml",
                id: "meta_yaml",
                mode: "text/x-yaml"
            },
            {
                cols: [
                    {},
                    {
                        view: "button",
                        type: "icon",
                        icon: "save",
                        align: "right",
                        width: 30,
                        click() {
                            TangoWebappHelpers.error("Not yet supported!");
                            // this.getTopParentView().save();
                        }
                    }
                ]
            }
        ]
    }
}


const predator_view = webix.protoUI({
    name: "predator_view",
    async update(){
        const value = await this.config.configurationManager.readPreExperimentDataCollectorYaml();
        this.$$('meta_yaml').update(value);
    },
    async save(){
        const value = this.$$('meta_yaml').getValue();

        this.config.configurationManager.writePreExperimentDataCollectorYaml(value)
            // .then(() => {
            //     this.config.master.commitConfiguration()
            // })
            // .then(() => {
            //     this.config.master.pushConfiguration()
            // });
    },
    _ui(){
        return {
            rows:[
                newMetaYamlView(),
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
                if(this.config.configurationManager.device == null) return;
                this.update();
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener,webix.IdSpace,webix.ui.layout);

export function newPredatorViewBody(config){
    return webix.extend({
        view: "predator_view"
    },config);
}

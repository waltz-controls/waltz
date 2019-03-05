/**
 * @module XenvHQ
 */

export class DataSource {
    
}

export const XenvHqController = MVC.Controller.extend("main",{
    buildUI: function (platform_api) {
        platform_api.ui_builder.add_mainview_item(newXenvHeadQuarterTab())
    },
    initialize:function(platform_api){
        //TODO
    }
});

const xenvHqToolbar = {
    view: "toolbar",
    maxHeight: 30,
    cols: [
        {
            view:"select",
            label: "Profile",
            options:[]//TODO load
        },
        {},
        {
            view: "button",
            type: "icon",
            icon: "cog",
            maxWidth: 30,
            click:function(){
                const $$txtSrc = this.getTopParentView().$$("txtSrc");
                if($$txtSrc.isVisible())
                    $$txtSrc.hide();
                else
                    $$txtSrc.show();
            }
        }
    ]
};

const xenvHqSettings = {
    id:"txtSrc",
    view: "text",
    value:"",
    label:"Src",
    inputAlign:"right",
    labelAlign:"right",
    hidden: true
};

const xenvHqBody = {
    cols:[
        {
            view: "fieldset",
            label: "Data sources",
            body: {
                rows: [
                    {
                        view: "list"
                    }
                ]
            }
        },
        {
            view: "fieldset",
            label: "Xenv servers",
            body: {
                rows: [
                    {
                        view: "list"
                    }
                ]
            }}
    ]
};

const xenvHqBottom = {
    view:"button",
    value: "Update & Restart all"
};

const xenvHq = webix.protoUI({
    name: "xenv-hq",
    restoreState:function(state){
        
    },
    _ui:function(){

        return {
            rows:[
                xenvHqToolbar,
                xenvHqSettings,
                xenvHqBody ,
                xenvHqBottom
            ]
        }
    },
    /**
     *
     * @param {DataSource} dataSource
     */
    addDataSource: function(dataSource){

    },
    /**
     *
     * @param {DataSource} dataSource
     */
    removeDataSource: function(dataSource){

    },
    $init:function(config){
        webix.extend(config, this._ui());
    }
}, TangoWebappPlatform.mixin.Stateful, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace,webix.ui.layout);

export function newXenvHeadQuarterTab(){
    return {
        header: "<span class='webix_icon fa-cubes'></span> Xenv HQ",
        borderless: true,
        body:
        {
            id: 'hq',
            view: "xenv-hq"
        }
    };
}


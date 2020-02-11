import {newXenvHeadQuarterTab} from "/xenvhq/index.js";

export const XenvHqController = class extends MVC.Controller {
    buildUI(platform_api) {
        // platform_api.ui_builder.add_mainview_item(newXenvSVGTab());
        platform_api.ui_builder.add_mainview_item(newXenvHeadQuarterTab());
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){
        const $$hq = $$('hq');


    }
};

//disable Xenv widget for master
XenvHqController.initialize();
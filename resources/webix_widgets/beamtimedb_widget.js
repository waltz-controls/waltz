/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 22.11.2019
 */
import {newBeamtimeDbIdsList, newBeamtimesBody} from '/beamtimedb/index.js';

class BeamtimeDbWidgetController extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_left_sidebar_item(newBeamtimeDbIdsList());

        platform_api.ui_builder.add_mainview_item(newBeamtimesBody());
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){}
}

BeamtimeDbWidgetController.initialize();




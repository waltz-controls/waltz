/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */

export const DashboardWidgetController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newDashboardWidgetTab({id: 'dashboard_widget'}));
    }

    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api) {
        const host = await PlatformContext.rest.fetchHost("localhost:10000");
        const device = await host.fetchDevice("sys/tg_test/1");
        let attr = await device.fetchAttr("double_scalar");


        // $$('dashboard_widget').addAttribute(attr);
        //
        // attr = await device.fetchAttr("long_scalar");
        // $$('dashboard_widget').addAttribute(attr);
    }
};

//disable Xenv widget for master
DashboardWidgetController.initialize();

const dashboard_widget = webix.protoUI({
    name: "dashboard_widget",
    _ui() {
        return {
            rows: [
                {
                    template: "header toolbar"
                },
                {
                    template: "hidden settings"
                },
                {
                    template: "multiview"
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());
    }
}, webix.ui.layout);

function newDashboardWidgetBody(config) {
    return webix.extend({
        view: "dashboard_widget"
    }, config);
}

export function newDashboardWidgetTab(config) {
    return {
        header: "<span class='webix_icon fa-dashboard'></span> DashboardWidget",
        borderless: true,
        body: newDashboardWidgetBody(config)

    };
}
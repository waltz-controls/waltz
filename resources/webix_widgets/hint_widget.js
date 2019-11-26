/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 05.11.2019
 */
export const HintController = class extends MVC.Controller {
    buildUI(platform_api) {
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){
        //TODO check local storage for flag
        webix.ui(hint).start();
    }
};

HintController.initialize();

//TODO extract messages into a dedicated file
//TODO revise messages, add more steps
//TODO embed hints for complex widgets e.g. device control
//TODO replace webix ids
const hint = {
    view: "hint",
    id: "hint",
    steps: [
        {
            el: "top-toolbar",
            title: "Welcome!",
            text: "This is top toolbar. Here you will find a menu with useful items.",
            event:"click"
        },
        {
            el: "left_panel_wrapper",
            title: "Left side panel!",
            text: "This panel has: " +
                "<ol><li><span class='webix_icon mdi mdi-sitemap'></span> Tango devices tree - currently open (expand Tango host to see devices)</li>" +
                "<li><span class='webix_icon mdi mdi-developer-board'></span>Tango device control panel - <b>collapsed</b>. Once device has been selected in the tree the control panel will show its attributes, commands and pipes</li>" +
                "<li><span class='webix_icon mdi mdi-information-variant'></span>Info panel - <b>collapsed</b>. This one show information about currently selected entity (host, device, attribute, command, pipe)</li>",
            event:"click"
        },
        {
            el: "main-tabview",
            title: "Main view!",
            text: "By default there is only one tab open - <span class='webix_icon mdi mdi-gauge'></span>Dashboard. Here you can create custom dashboard profiles. Just drag and drop devices or attributes here from the left panel...",
            event:"click"
        },
        {
            el: ".add_profile_icon",
            title: "Create more Dashboard profiles!",
            text: "Click on this button shows control widget where you can create new Dashboard profiles.",
            event:"click"
        },
        {
            el: "right_panel_wrapper",
            title: "Right panel!",
            text: "Displays user actions log",
            event:"click"
        },
        {
            el: "bottom-toolbar",
            title: "Bottom toolbar!",
            text: "Here you will find last Tango REST API request status and application log.",
            event:"click"
        },
        {
            el: ".help_menu_icon",
            title: "Need more help?",
            text: "Checkout 'Help' menu for more information!",
            event:"click"
        }
    ]
};


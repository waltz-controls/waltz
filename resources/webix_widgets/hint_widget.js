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
            el: "$accordionitem1",
            title: "Left side panel!",
            text: "This panel has: " +
                "<ol><li><span class='webix_icon fa-sitemap'></span> Tango devices tree - currently open (expand Tango host to see devices)</li>" +
                "<li><span class='webix_icon fa-keyboard-o'></span>Tango device control panel - collapsed. Once device has been selected in the tree the control panel will show its attributes, commands and pipes</li>" +
                "<li><span class='webix_icon fa-info'></span>Info panel - collapsed. This one show information about currently selected entity (host, device, attribute, command, pipe)</li>",
            event:"click"
        },
        {
            el: "main-tabview",
            title: "Main view!",
            text: "By default there is only one tab open - <span class='webix_icon fa-dashboard'></span>DashboardWidget. Here you can create custom dashboard profiles. Just drag and drop devices or attributes here from the left panel...",
            event:"click"
        },
        {
            el: "$button48",
            title: "Create more Dashboard profiles!",
            text: "Click on this button shows control widget where you can create new Dashboard profiles.",
            event:"click"
        },
        {
            el: "$accordionitem3",
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
            el: "$button3",
            title: "Need more help?",
            text: "Checkout 'Help' menu for more information!",
            event:"click"
        }
    ]
};


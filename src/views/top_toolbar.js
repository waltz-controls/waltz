import {kMainWindow} from "widgets/main_window";

webix.ui({
    view: "popup",
    id: "userMenu",
    width: 100,
    body: {
        view: "list",
        data: [
            {id: "userSignOut", value: "Logout...", icon: "mdi mdi-logout"}
        ],
        autoheight: true,
        borderless: true,
        on: {
            onItemClick: function (id) {
                if (id === "userSignOut") {
                    $$(kMainWindow).callEvent('logout',[])

                }
                $$("userMenu").hide();
            }
        }
    }
});

const toolsMenu = webix.ui({
    view: "popup",
    id: "toolsMenu",
    width: 100,
    body: {
        view: "list",
        data: [
            {id: "toolsScripting", value: "Scripting"},
            {id: "toolsAstor", value: "Manager"},
            {id: "toolsTerminal", value: "Terminal"}
        ],
        autoheight: true,
        borderless: true,
        on: {
            onItemClick: function (id) {
                switch (id) {
                    case "toolsScripting":
                        $$(kMainWindow).callEvent('scripting',[])
                        break;
                    case "toolsAstor":
                        $$(kMainWindow).callEvent('manager',[])
                        break;
                    case "toolsTerminal":
                        PlatformApi.PlatformUIController().openTerminalTab();
                        break;
                    default:
                        webix.message("Submenu click: " + id);
                        break;
                }
                $$("toolsMenu").hide();
            }
        }
    }
});

var helpMenu = webix.ui({
    view: "popup",
    id: "helpMenu",
    minWidth: 120,
    body: {
        view: "list",
        data: [
            {id: "helpAbout", value: "About"},
            {id: "helpDocs", value: "User docs"},
            {id: "reportIssue", value: "New issue", icon: "mdi mdi-github-circle"}
        ],
        autoheight: true,
        borderless: true,
        on: {
            onItemClick: function (id) {
                if (id === "helpAbout") {
                    window.open("https://www.waltz-controls.space/en/latest/", "_blank");
                }
                if (id === "helpDocs") {
                    window.open("https://www.waltz-controls.space/en/latest/user_guide/", "_blank");
                }
                if (id === "reportIssue") {
                    window.open("https://github.com/tango-controls/waltz/issues/new", "_blank");//TODO issue template ?template=issue.md; put issue.md into .github/ISSUE_TEMPLATE
                }
                $$("helpMenu").hide();
            }
        }
    }
});

const top_toolbar = webix.protoUI({
    name: 'top_toolbar',
    ui(config){
        return {
            cols: [
                {
                    view: "icon", icon: "mdi mdi-menu",
                    click(){
                        if( config.root.leftPanel.isVisible())
                            config.root.leftPanel.hide();
                        else
                            config.root.leftPanel.show();
                    }
                },
                {
                    view: "icon",
                    icon: "mdi mdi-account",
                    id: "btnUsername",
                    popup: "userMenu",
                    borderless: true
                },
                {
                    view: "icon",
                    icon: "mdi mdi-tools",
                    id: "btnTools",
                    label: "Tools",
                    popup: "toolsMenu",
                    borderless: true
                },
                {
                    view: "icon",
                    icon: "mdi mdi-help-circle",
                    css: "help_menu_icon",
                    id: "btnMenu",
                    label: "Help",
                    popup: "helpMenu",
                    borderless: true
                },
                {
                    fillSpace:true
                },
                {
                    view: "icon", icon: "mdi mdi-menu",
                    click(){
                        if( config.root.rightPanel.isVisible())
                            config.root.rightPanel.hide();
                        else
                            config.root.rightPanel.show();
                    }
                }
            ]
        }
    },
    $init(config){
        webix.extend(config, this.ui(config));
    },
    defaults: {
        height: 32
    }
},webix.IdSpace, webix.ui.toolbar);

export default function newTopToolbar(root) {


    return {
        root,
        view: 'top_toolbar'
    }
}
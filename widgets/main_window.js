import {WaltzWidget} from "@waltz-controls/middleware";
import newTopToolbar from "views/top_toolbar";
import newBottomToolbar from "views/bottom_toolbar";
import newLeftPanel from "views/left_panel";
import newRightPanel from "views/right_panel";
import newMainView from "views/main_view";

export default class MainWindow extends WaltzWidget{
    constructor() {
        super('main');

    }

    config(){
        this.listen(user => this.render(),'login')

        this.listen(() => {
            $$('main').destructor();
        },'logout')
    }

    render() {


        const main = webix.ui({
            id:this.name,
            rows: [
                newTopToolbar(this),
                {
                    cols: [
                        newLeftPanel(this),
                        newMainView(this),
                        newRightPanel(this)
                    ]
                },
                newBottomToolbar(this)
            ]
        });

        main.attachEvent('logout',()=> {
            webix.storage.session.remove('user');
            this.dispatch({},'logout');
        })

        webix.ui.fullScreen();
    }

    run(){
        webix.ui({
            view: "popup",
            id: "userMenu",
            width: 100,
            body: {
                view: "list",
                data: [
                    {id: "userSettings", value: "Settings"},
                    {id: "userSignOut", value: "Logout...", icon: "mdi mdi-logout"}
                ],
                autoheight: true,
                borderless: true,
                on: {
                    onItemClick: function (id) {
                        if (id === "userSettings") {
                            PlatformApi.PlatformUIController().openSettingsTab();
                        }
                        if (id === "userSignOut") {
                            $$('main').callEvent('logout',[])

                        }
                        $$("userMenu").hide();
                    }
                }
            }
        });
    }

}
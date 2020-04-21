import {WaltzWidget} from "@waltz-controls/middleware";
import newTopToolbar from "views/top_toolbar";
import newBottomToolbar from "views/bottom_toolbar";
import newLeftPanel from "views/left_panel";
import newRightPanel from "views/right_panel";
import newMainView from "views/main_view";

export const kMainWindow = 'widget:main';

export default class MainWindow extends WaltzWidget{
    constructor() {
        super(kMainWindow);

    }

    config(){
        this.listen(user => this.render(),'login')

        this.listen(() => {
            $$(this.name).destructor();
        },'logout')
    }

    render() {
        const main = webix.ui({
            id:this.name,
            type: 'space',
            rows: [
                newTopToolbar(this),
                {
                    type:'space',
                    borderless:true,
                    cols: [
                        newLeftPanel(this),
                        {view:'resizer'},
                        {
                            ...newMainView(this),
                            gravity:4
                        },
                        {view:'resizer'},
                        newRightPanel(this)
                    ]
                },
                newBottomToolbar(this)
            ]
        });

        main.attachEvent('logout',()=> {
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
                            $$(kMainWindow).callEvent('logout',[])

                        }
                        $$("userMenu").hide();
                    }
                }
            }
        });
    }

    /**
     *
     * @return {webix.ui.baseview}
     */
    get leftPanel(){
        return $$('left_panel');
    }

    /**
     *
     * @return {webix.ui.baseview}
     */
    get mainView(){
        return $$('main_view');
    }

    /**
     *
     * @return {webix.ui.baseview}
     */
    get rightPanel(){
        return $$('right_panel');
    }
}
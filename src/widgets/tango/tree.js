import {WaltzWidget} from "@waltz-controls/middleware";
import {kMainWindow} from "widgets/main_window";
import {kTangoRestContext} from "controllers/tango_rest";

export const kTangoTree = 'widget:tango_tree';

export default class TangoTree extends WaltzWidget {
    constructor() {
        super(kTangoTree);
    }

    async config(){
        this.listen(() => this.render(), 'login');
        // this.rest = await this.app.getContext(kTangoRest);
    }

    ui(){
        return {
            view:'accordionitem',
            header:'tree',
            body: {
                view: 'tree',
                id:this.name,
                select: true,
                activeTitle: true,
                data: []
            }
        }
    }

    render(){
        this.app.getWidget(kMainWindow).leftPanel.addView(this.ui());
    }

    async run(){
        const rest = await this.app.getContext(kTangoRestContext);
        rest.toTangoRestApiRequest().devices('tree')
            .get('?host=localhost:10000')
            .subscribe({
                next: tree => $$(this.name).parse(tree),
                error: err => webix.message({type:'error', text:err.errors[0].description})
            })


        setTimeout(() => {
            this.dispatch('localhost:10000/sys/tg_test/1','select_device','user')
        },3000)
    }
}
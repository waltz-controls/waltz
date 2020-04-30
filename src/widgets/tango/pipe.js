import {WaltzWidget} from "@waltz-controls/middleware";
import HostTabWidget from "widgets/tango/host";
import "views/tango/pipe_view";
import {kControllerUserAction} from "controllers/user_action_controller";
import {ReadTangoPipe} from "models/user_action";
import {kUserContext} from "controllers/user_context";

const kWidgetTangoPipe = "widget:tango_pipe";

function header(pipe){
    return `<span class='webix_icon mdi mdi-${pipe.icon}'></span>[<span class='webix_strong'>${pipe.device}/${pipe.name}</span>]`;
}
export default class PipeWidget extends WaltzWidget {
    /**
     *
     * @param {Application} app
     * @param {TangoPipe} pipe
     */
    constructor(app, pipe) {
        super(kWidgetTangoPipe, app);
        this.pipe = pipe;

        this.listen(action => {
            if(action.action !== "pipe") return;
            this.update(action.data)
        },kControllerUserAction)
    }

    ui(){
        return {
            header: header(this.pipe),
            close: true,
            borderless: true,
            body: {
                id: this.pipe.id,
                root: this,
                view: "pipe_view"
            }
        }
    }

    get view(){
        return $$(this.pipe.host).$$(this.pipe.id);
    }

    run(){
        const hostTab = $$(this.pipe.host) || new HostTabWidget(this.pipe.host, this.app).run(this.ui())

        hostTab.show();

        const tab = hostTab.$$(this.pipe.id) || $$(hostTab.addView(this.ui()));

        tab.show();

        return this;
    }

    update(data){
        this.view.plot.update(data)
    }

    async refresh(){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ReadTangoPipe({user, pipe: this.pipe}))
    }
}